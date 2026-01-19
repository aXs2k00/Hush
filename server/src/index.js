import express from "express";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8787;

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/chat", async (req, res) => {
  const { prompt, model, temperature, maxTokens } = req.body ?? {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt is required" });
  }

  const apiKey = process.env.CODESTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "CODESTRAL_API_KEY is not set" });
  }

  try {
    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model ?? "codestral-latest",
        temperature: typeof temperature === "number" ? temperature : 0.2,
        max_tokens: typeof maxTokens === "number" ? maxTokens : 512,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return res.json({ content, raw: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Codestral proxy listening on http://localhost:${port}`);
});
