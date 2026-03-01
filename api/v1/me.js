import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
      meta: { version: "1" }
    });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "me.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const payload = {
      success: true,
      data,
      meta: {
        version: "1",
        generated_at: new Date().toISOString()
      }
    };
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load profile" },
      meta: { version: "1" }
    });
  }
}
