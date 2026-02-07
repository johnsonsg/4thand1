# Payload Setup (Step‑by‑Step)

Payload is embedded in the Next.js app.

## 1) Configure Env Vars

Set in `frontend/.env.local`:

- `PAYLOAD_SECRET` — any strong random string
- `PAYLOAD_PUBLIC_SERVER_URL` — `http://localhost:3000` for local

## 2) Start the App

From repo root:

- `npm run dev`

## 3) Create the Admin User

1. Open http://localhost:3000/admin
2. On first visit, create the initial admin user.
3. Use that account to manage users and content.

## 4) Verify API Routes

- REST API: http://localhost:3000/cms-api
- GraphQL: http://localhost:3000/graphql

## Notes

- The admin user comes from the `users` collection.
- If you need to reset, remove the user record in MongoDB and re‑create it.
