# Clerk Setup (Step‑by‑Step)

## 1) Create a Clerk App

1. Go to https://dashboard.clerk.com
2. Click **Create application**.
3. Choose your app name and authentication methods.
4. Finish the setup.

## 2) Get API Keys

1. In the Clerk dashboard, open your app.
2. Go to **API Keys**.
3. Copy:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

## 3) Add Keys to the Project

1. Copy the env example:
   - `cp frontend/.env.example frontend/.env.local`
2. Paste the keys into `frontend/.env.local`.

## 4) Configure Allowed URLs (optional but recommended)

1. In the Clerk dashboard, open **Paths & URLs**.
2. Set your local dev URL: `http://localhost:3000`.
3. Add production URL(s) when available.

## 5) Test

- Run `npm run dev` from repo root.
- Load the app and verify authentication flows.

## Troubleshooting

- If auth fails, recheck the keys and restart the dev server.
