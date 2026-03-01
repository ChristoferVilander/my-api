export default function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  const payload = {
    success: true,
    data: {
      message: "Välkommen till API v1",
      endpoints: ["/api/v1/me"]
    },
    meta: {
      version: "1",
      generated_at: new Date().toISOString()
    }
  };
  res.status(200).json(payload);
}
