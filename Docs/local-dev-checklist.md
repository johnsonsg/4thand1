# Local Dev Checklist

## 1) Clone and Install

- `git clone <repo>`
- `cd 4thand1`
- `npm install`

## 2) Configure Env Vars

Copy env example and fill values:

- `cp frontend/.env.example frontend/.env.local`

Set:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `PAYLOAD_SECRET`
- `MONGODB_URI`
- `PAYLOAD_PUBLIC_SERVER_URL` (default `http://localhost:3000`)

## 3) Set up Clerk

- Create an app: https://dashboard.clerk.com
- Copy Publishable + Secret keys into `.env.local`

## 4) Set up MongoDB

- Create a DB and user (Atlas or local)
- Copy connection string into `MONGODB_URI`
- Ensure network access is allowed from your dev machine

## 5) Start the App

From repo root:

- `npm run dev`

Open http://localhost:3000

## 6) Create Admin User (Payload)

- Visit http://localhost:3000/admin
- Create the initial admin user on first visit

## 7) Verify Demo Route

- Visit `/demo/alpha`
- You should see the slug and demo data

## Troubleshooting

- If `/admin` fails, recheck `PAYLOAD_SECRET` and `MONGODB_URI`.
- If auth fails, recheck Clerk keys and dashboard settings.
