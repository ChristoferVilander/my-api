export default function handler(req, res) {
  res.status(200).json({
    message: "Det här är mitt publika bio-API. Gör en request mot /api/v1/me",
    endpoints: {
      me: "/api/v1/me"
    },
    example: "curl https://my-api-psi-henna.vercel.app/api/v1/me"
  });
}
