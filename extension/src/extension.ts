import * as vscode from "vscode";

const outputChannel = vscode.window.createOutputChannel("Codestral Assistant");

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand("codestralAssistant.ask", async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: "Ask Codestral",
      placeHolder: "Describe what you need help with"
    });

    if (!prompt) {
      return;
    }

    const config = vscode.workspace.getConfiguration();
    const serverUrl = config.get<string>("codestralAssistant.serverUrl") ?? "http://localhost:8787";

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
            body: JSON.stringify({ prompt })
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
