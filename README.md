# Hush

Intelligent notification handler.

## Codestral Integration

This repo now includes a lightweight Node.js API server that proxies requests to Codestral, plus a VS Code extension that sends prompts to the server and displays responses inside the IDE.

### 1) Start the Codestral proxy server

```bash
cd server
npm install
export CODESTRAL_API_KEY=your-key
npm start
```

Optional configuration:
- Copy `server/.env.example` to `.env` and set `CODESTRAL_API_KEY`.
- Set `PORT` if you want a different port (default `8787`).

### 2) Build the VS Code extension

```bash
cd extension
npm install
npm run compile
```

Open the `extension` folder in VS Code and run the command **Codestral: Ask Assistant**.
Responses are shown in the **Codestral Assistant** output channel.
