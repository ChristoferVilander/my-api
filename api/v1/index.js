export default function handler(req, res) {
  res.status(200).json({
    message: "Välkommen till API v1",
    endpoints: [
      "/api/v1/me"
    ]
  })
}
