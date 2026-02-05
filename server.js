import express from "express";

const app = express();
app.use(express.json());

// ===== ENV จาก Render =====
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// health check
app.get("/", (req, res) => {
  res.send("OK");
});

// proxy heartbeat
app.post("/heartbeat", async (req, res) => {
  try {
    const { device_code } = req.body;

    if (!device_code) {
      return res.status(400).json({ success: false, error: "device_code missing" });
    }

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/heartbeat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ device_code })
      }
    );

    const text = await response.text();
    res.status(response.status).send(text);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Render ใช้ PORT จาก env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});

