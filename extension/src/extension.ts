import * as vscode from "vscode";

const outputChannel = vscode.window.createOutputChannel("Codestral Assistant");

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("codestralAssistant.ask", async () => {
    const activeEditor = vscode.window.activeTextEditor;
    const selectedText = activeEditor?.document.getText(activeEditor.selection) ?? "";
    const prompt = await vscode.window.showInputBox({
      prompt: "Ask Codestral",
      placeHolder: selectedText
        ? "Describe what you need help with (selection will be included)"
        : "Describe what you need help with"
    });

    if (!prompt) {
      return;
    }

    const config = vscode.workspace.getConfiguration();
    const serverUrl = config.get<string>("codestralAssistant.serverUrl") ?? "http://localhost:8787";
    const model = config.get<string>("codestralAssistant.model");
    const temperature = config.get<number>("codestralAssistant.temperature");
    const maxTokens = config.get<number>("codestralAssistant.maxTokens");

    const fullPrompt = selectedText
      ? `Use the following context to answer the question.\n\nContext:\n${selectedText}\n\nQuestion:\n${prompt}`
      : prompt;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Codestral Assistant",
        cancellable: false
      },
      async () => {
        try {
          const response = await fetch(`${serverUrl}/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              prompt: fullPrompt,
              model,
              temperature,
              maxTokens
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with ${response.status}`);
          }

          const data = (await response.json()) as { content?: string };
          const content = data.content?.trim() ?? "";

          outputChannel.show(true);
          outputChannel.appendLine(`\nUser: ${prompt}`);
          outputChannel.appendLine("Assistant:");
          outputChannel.appendLine(content || "(empty response)");

          const document = await vscode.workspace.openTextDocument({
            language: "markdown",
            content: content || "(empty response)"
          });
          await vscode.window.showTextDocument(document, { preview: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          vscode.window.showErrorMessage(`Codestral request failed: ${message}`);
        }
      }
    );
  });

  context.subscriptions.push(command, outputChannel);
}

export function deactivate() {
  outputChannel.dispose();
}
