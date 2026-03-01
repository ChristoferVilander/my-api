# Security Audit – Christofer API

*Genomgång: 2026-02-24*

## Sammanfattning

Projektet är ett litet, skrivskyddat personligt API utan inloggning. Risknivån bedöms som **låg**. Inga kritiska eller höga brister hittades. Nedan är bedömning per område och konkreta förbättringsförslag.

---

## 1. API-endpoints

### `GET /api/v1` (`api/v1/index.js`)
- **Input:** Ingen användarinput används.
- **Sårbarheter:** Inga. Svarar endast med statisk JSON.
- **Status:** OK.

### `GET /api/v1/me` (`api/v1/me.js`)
- **Path traversal:** Filvägen byggs med `path.join(process.cwd(), "data", "me.json")`. Ingen användarinput ingår → ingen risk för path traversal (t.ex. `/api/v1/me?file=../../../etc/passwd` används inte).
- **Metod:** Endast GET tillåts; övriga metoder får 405. Bra.
- **Felhantering:** Vid fel returneras generiskt meddelande ("Failed to load profile"). Ingen stack trace, filväg eller systeminfo läcker ut. Bra.
- **Status:** OK.

**Rekommendation:** Om du i framtiden lägger till query- eller path-parametrar ska dessa valideras och aldrig användas direkt i `path.join()` eller i SQL/kommandon.

---

## 2. Data och känslig information

### `data/me.json`
- Innehåll: namn, titel, plats (land), bio, skills, publika länkar (webb, GitHub, LinkedIn).
- Ingen e-post, telefon, personnummer eller inloggningsuppgifter.
- **Status:** Lämplig nivå för ett öppet API. Se bara till att inte lägga in känslig PII här utan att ha övervägt konsekvenserna.

### Hemligheter i repo
- Ingen `.env`, API-nycklar eller lösenord hittades i de granskade filerna.
- **Status:** OK. Fortsätt undvik att committa `.env` eller liknande; använd Vercel-miljövariabler om du behöver hemligheter senare.

---

## 3. Frontend / index.html

- Sidan är statisk HTML + CSS. Ingen användarinput renderas.
- Ingen JavaScript som tar emot eller visar användardata.
- **XSS:** Ingen risk med nuvarande innehåll.
- Inga externa skript (CDN, analytics) → ingen supply-chain-risk i denna fil.
- **Status:** OK.

---

## 4. Headers och skydd på API-nivå

- **Content-Type:** Vercel sätter sannolikt `application/json` när du använder `.json()`. Kontrollera i webbläsarens nätverk-flik om du vill vara säker.
- **X-Content-Type-Options: nosniff:** Sätts inte explicit. Rekommenderas för API-svar så att webbläsare inte gissar MIME-typ.
- **CORS:** Ej satt. Om du anropar API:et från en webbapp på annan domän kan webbläsaren blockera anrop. Det är inte en säkerhetsbrist i sig, men om du lägger till CORS ska du undvika `Access-Control-Allow-Origin: *` om du senare lägger till känslig data eller auth.
- **Rate limiting:** Finns inte. För ett litet personligt API är det ofta acceptabelt, men vid trafikökning kan rate limiting (t.ex. på Vercel-nivå eller via en proxy) minska risk för missbruk/överbelastning.

**Rekommendation:** Lägg till `X-Content-Type-Options: nosniff` på API-svaren. Övriga headers kan du lägga till när du behöver dem (t.ex. CORS när du har en frontend på annan domän).

---

## 5. Beroenden och byggen

- Inget `package.json` eller `node_modules` hittades. Inga tredjepartsberoenden att granska.
- **Status:** Ingen beroenderisk med nuvarande upplägg. Om du senare lägger till npm-paket: kör då `npm audit` regelbundet och håll paket uppdaterade.

---

## 6. Övrigt

- **HTTPS:** Vercel hanterar TLS; anrop ska göras mot `https://`.
- **Framtida endpoints:** Vid POST/PUT/DELETE eller inloggning krävs inputvalidering, säker sessionhantering och att hemligheter aldrig committas.

---

## Åtgärdslista (prioriterad)

| Prioritet | Åtgärd |
|----------|--------|
| Låg      | Sätt header `X-Content-Type-Options: nosniff` på API-svar. |
| Låg      | När/om du lägger till CORS, begränsa `Access-Control-Allow-Origin` till domäner du litar på (undvik `*` om du får känslig data eller auth). |
| Info     | Vid fler endpoints: validera och sanera all input; använd aldrig användardata direkt i filvägar eller kommandon. |
| Info     | Om trafiken växer: överväg rate limiting (Vercel eller annan lösning). |

---

*Auditen baseras på de filer som finns i repot och den beskrivna arkitekturen. Vid större ändringar (nya endpoints, auth, externa tjänster) bör säkerheten granskas igen.*
