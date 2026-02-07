# MongoDB Setup (Step‑by‑Step)

You can use MongoDB Atlas (cloud) or a local MongoDB instance.

## Option A: MongoDB Atlas (Recommended)

### 1) Create a Cluster

1. Go to https://cloud.mongodb.com
2. Create an account and project.
3. Click **Build a Database** and choose a free tier cluster.

### 2) Create a DB User

1. Go to **Database Access**.
2. Click **Add New Database User**.
3. Create a user with **read/write** access.

### 3) Allow Network Access

1. Go to **Network Access**.
2. Add your IP (or `0.0.0.0/0` for dev only).

### 4) Create a Database

1. Go to **Database** (or **Browse Collections**) in Atlas.
2. Click **Add My Own Data**.
3. Enter a database name (e.g. `4thand1`) and a collection name (e.g. `users`).
4. Create the database.

### 5) Get Connection String

1. Go to **Database** → **Connect**.
2. Choose **Drivers**.
3. Copy the connection string.
4. Replace `<username>` and `<password>` with your DB user.

### 6) Add to Env

Set in `frontend/.env.local`:

- `MONGODB_URI=<your-connection-string>`

## Option B: Local MongoDB

1. Install MongoDB locally.
2. Start the database service.
3. Use a local connection string:

- `MONGODB_URI=mongodb://127.0.0.1:27017/4thand1`

## Test

- Start the app and visit `/admin`.
- If the admin loads, MongoDB is connected.
