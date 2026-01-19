# Hush Codestral Assistant (VS Code Extension)

This VS Code extension sends prompts to the local Codestral proxy server and renders the response in a dedicated output channel.

## Setup

1. Install dependencies and compile the extension:
   ```bash
   npm install
   npm run compile
   ```
2. Configure the proxy server URL if it differs from the default.
   - **Setting**: `codestralAssistant.serverUrl`
   - **Default**: `http://localhost:8787`

## Usage

1. Start the proxy server from the `server` directory.
2. In VS Code, run **Codestral: Ask Assistant** from the command palette.
3. Enter a prompt and view the response in the **Codestral Assistant** output channel.

## Development Tips

- Use `npm run watch` to compile automatically while editing.
