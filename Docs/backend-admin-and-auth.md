# Backend: Admin, Clerk, Payload, MongoDB

## Payload Admin

The admin UI is provided by Payload. It runs inside the Next app.

- Admin URL: `/admin`
- API route: `/cms-api`
- GraphQL route: `/graphql`

## Required Env Vars (frontend/.env.local)

Copy `frontend/.env.example` to `frontend/.env.local` and set:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `PAYLOAD_SECRET`
- `MONGODB_URI`
- `PAYLOAD_PUBLIC_SERVER_URL` (default `http://localhost:3000`)

## Clerk Setup

1. Create a Clerk application in the Clerk dashboard.
2. Copy the **Publishable Key** and **Secret Key** into:
	- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
	- `CLERK_SECRET_KEY`
3. If you use custom domains or redirect URLs, configure them in the Clerk dashboard.

Dashboard:

- https://dashboard.clerk.com

Step‑by‑step guide:

- [Docs/clerk-setup.md](clerk-setup.md)

## MongoDB Setup

Use MongoDB Atlas or a local MongoDB instance.

1. Create a database and a user with read/write access.
2. Copy the connection string into `MONGODB_URI`.
3. Verify the database is reachable from your dev machine.

Atlas:

- https://cloud.mongodb.com

Step‑by‑step guide:

- [Docs/mongodb-setup.md](mongodb-setup.md)

## Payload Setup

Payload runs inside the Next app. Configuration is in:

- [frontend/payload.config.ts](../frontend/payload.config.ts)

Make sure `PAYLOAD_SECRET` is set (any strong random string is fine for dev).

Step‑by‑step guide:

- [Docs/payload-setup.md](payload-setup.md)

## Creating an Admin User

Payload uses the `users` collection for admin auth.

1. Start the app locally.
2. Visit `/admin`.
3. The first visit prompts you to create the initial admin user.
4. After that, create additional users inside the admin UI.

If you already created an admin user and forgot the password, reset it in MongoDB or delete the user record and recreate it.

## Clerk (Auth)

- Clerk is used for authentication in the frontend.
- Ensure Clerk keys are set in your environment.
- Manage users and settings in the Clerk dashboard.

## MongoDB

- Payload stores data in MongoDB.
- Ensure your `MONGODB_URI` points to a reachable database.
- Keep dev/test DBs separate from production.

## Tips

- Rotate secrets periodically and never commit them.
