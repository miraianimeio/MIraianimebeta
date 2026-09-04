import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_HOSTS = {
  1: "https://megaplay.buzz/stream/ani",
  2: "https://megaplay.buzz/stream/ani",
  3: "https://vidnest.fun/animepahe",
  4: "https://vidnest.fun/animepahe",
  5: "https://vidnest.fun/anime",
  6: "https://vidnest.fun/anime"
};

app.use(express.static("."));

app.get("/api/server-check", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const serverCode = Number(req.query.server);
  const animeId = String(req.query.animeId || "");
  const episode = String(req.query.episode || "");
  const baseUrl = SERVER_HOSTS[serverCode];

  if (!baseUrl || !/^\d+$/.test(animeId) || !/^\d+$/.test(episode)) {
    return res.status(400).json({ available: false });
  }

  const language = serverCode % 2 === 0 ? "dub" : "sub";
  const targetUrl = `${baseUrl}/${animeId}/${episode}/${language}`;
  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8000)
    });
    const body = (await response.text()).slice(0, 50000);
    const title = (body.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "").trim();
    const providerError = /^Error\b/i.test(title) ||
      /VidNest\s*[–-].*Streaming Embeds/i.test(title) ||
      /Error:\s*Failed to fetch|>\s*404\s*</i.test(body);
    res.json({ available: response.ok && !providerError });
  } catch {
    res.json({ available: null });
  }
});

app.get("/api/manga", async (req, res) => {
  try {
    const queryString = req.url.includes("?") ? req.url.split("?")[1] : "";
    const url = `https://api.mangadex.org/manga?${queryString}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MiraAnimeApp/1.0"
      }
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch manga data" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mirai server running on http://localhost:${PORT}`);
});