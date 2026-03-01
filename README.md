# Christofer API

A small personal API that exposes structured information about me—profile, skills, and links. Hosted on [Vercel](https://vercel.com).

## Base URL

```
https://christofervilander.se/api/v1
```

## Endpoints

| Method | Endpoint    | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/api/v1`   | API overview and list of endpoints   |
| GET    | `/api/v1/me`| Profile (name, title, location, bio, links) |

## Response format

All successful responses use the same structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "version": "1",
    "generated_at": "2026-02-24T12:00:00.000Z"
  }
}
```

Errors return:

```json
{
  "success": false,
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed"
  },
  "meta": { "version": "1" }
}
```

## Example

```bash
curl https://christofervilander.se/api/v1/me
```

## Project structure

```
├── api/
│   └── v1/
│       ├── index.js   # GET /api/v1
│       └── me.js     # GET /api/v1/me
├── data/
│   └── me.json       # Profile data
├── index.html        # API documentation
└── README.md
```

## Deploy

This project is set up for [Vercel](https://vercel.com). 

## License

Private use. © Christofer Vilander.
