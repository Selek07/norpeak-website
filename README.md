# Norpeak Website

Norpeak studio website, adapted (with permission) from Rene Kolednik's portfolio. An Expo + React Native Web frontend and a lean Express/Mongo contact API.

## Structure

- `frontend/` - Expo app for web, built with React Native Web (static export)
- `backend/` - Express API with the contact route
- `e2e/` - Playwright smoke tests (run against the Metro dev server)

## Run locally

1. Install dependencies in `frontend/` and `backend/`
2. Copy `backend/.env.example` to `backend/.env` and fill in the values
3. Start the API with `npm run dev:backend`
4. Start the frontend with `npm run dev:frontend`

Local dev needs no `EXPO_PUBLIC_API_URL`: `frontend/lib/api.js` falls back to
`http://localhost:5000/api` on localhost. The production API URL is committed
in `frontend/.env.production`, which `expo export` (the production build)
loads automatically. Do not put the production URL in `frontend/.env` — that
would make local dev and e2e tests hit the live API.

## Contact flow

`POST /api/contact` validates input (types, email format, length limits
mirroring the Mongoose schema), rate-limits to 5 requests per 15 minutes, and:

- saves messages to MongoDB when `MONGO_URI` is configured
- sends an email notification through Resend

If neither storage nor delivery succeeds, the endpoint returns 503 instead of
pretending the message was delivered.

## Deploy Backend To Render

The repo includes [render.yaml](render.yaml) for the backend service.

For the first deployment:

1. Push the repo to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Deploy the `backend/` service and fill in the env vars the blueprint
   prompts for. `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are **required** —
   the API exits at startup without them. Set `CLIENT_URL` to the site
   origin(s) (e.g. `https://norpeak.com`) or browsers will be blocked by
   CORS in production. `MONGO_URI` is optional (email-only mode without it).
4. After Render gives you the backend URL, make sure it matches
   `EXPO_PUBLIC_API_URL` in `frontend/.env.production`.

## Deploy Frontend To Render

The frontend deploys as a Render Static Site:

- Build command: `npm ci --prefix frontend && npm --prefix frontend run export:web`
- Publish directory: `frontend/dist`

`EXPO_PUBLIC_API_URL` is baked in at build time from
`frontend/.env.production` (a Render env var with the same name also works
and takes precedence). The export script copies `+not-found.html` to
`404.html` so Render serves the branded 404 page.

## GitHub Pages (default domain)

`.github/workflows/pages.yml` builds the static site on every push to `main`
and publishes it to `https://<owner>.github.io/<repo>/`. It sets
`EXPO_BASE_URL=/<repo>` so assets resolve under the sub-path. For a custom
domain served from the root, drop `EXPO_BASE_URL` and add a `CNAME`.
