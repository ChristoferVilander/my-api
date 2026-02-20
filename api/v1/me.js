import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const filePath = path.join(process.cwd(), "data", "me.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  res.setHeader("Cache-Control", "public, max-age=300");
  return res.status(200).json(data);
}
