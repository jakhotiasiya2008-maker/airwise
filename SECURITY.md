# Security Controls & Policy — AirWise India

AirWise India implements a defense-in-depth security model to ensure user safety, data privacy, and prompt-injection resilience.

## 1. Zero Hallucination & Deterministic Air Quality Grounding
- **Strict Boundary**: The GenAI layer (Google Gemini 2.5 Flash) is strictly forbidden from generating or estimating air quality metrics (AQI, PM2.5, PM10).
- All numerical data originates from verified live APIs (Open-Meteo European CAMS / CPCB NAQI formula).
- The LLM only receives read-only, verified measurements as structured context.

## 2. API Key Protection & Zero Client Leaks
- All third-party AI keys (`GEMINI_API_KEY`) remain strictly server-side in Next.js Server App Router API routes (`/api/guidance`, `/api/chat`).
- No secret environment variables are prefixed with `NEXT_PUBLIC_`.
- Server-side calls prevent any client-side leakage, browser inspection, or token theft.

## 3. Prompt Injection Defenses & Input Sanitization
- User notes and chat follow-up inputs are validated with Zod schemas enforcing strict character caps (max 300 chars).
- Input sanitizer strips system instruction overrides, markdown delimiters, backticks, and prompt marker keywords (`ignore previous instructions`, `system:`).
- User inputs are wrapped in explicit XML boundary tags (`<user_context>`, `<untrusted_user_notes>`).
- Structured JSON output schemas validate every field before delivery to the client.

## 4. Zero-Quota Deterministic Offline Fallback
- If Gemini API quota is exhausted, rate limited, or offline, the system seamlessly falls back to a deterministic, rule-based algorithmic guidance engine.
- Every rule recommendation has been verified against CPCB guidelines, pulmonary clinical research, and building science.
- The UI prominently flags the active engine (`Gemini 2.5 Flash` vs `Rule-based guidance`).

## 5. Privacy & Zero-DB Architecture
- Zero database storage: all user profile attributes (children, seniors, commute mode) are stored strictly on the user's client device in `localStorage`.
- No personally identifiable information (PII) or GPS tracks are logged or stored on any server.

## 6. HTTP Security Headers
The application enforces strict security response headers:
- `Content-Security-Policy`: Disallows unauthorized external scripts and framing (`frame-ancestors 'none'`).
- `Strict-Transport-Security` (HSTS): `max-age=63072000; includeSubDomains; preload`.
- `X-Content-Type-Options`: `nosniff`.
- `X-Frame-Options`: `DENY` (anti-clickjacking).
- `Referrer-Policy`: `strict-origin-when-cross-origin`.
- `Permissions-Policy`: Restricts camera, microphone, and locks geolocation to `self`.

## 7. Rate Limiting & Denial of Service Protection
- Token-bucket in-memory rate limiter per IP address on all `/api/*` endpoints (max 60 requests/minute per client).
- Automatic `429 Too Many Requests` response with `Retry-After` headers.
