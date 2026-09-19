# Beacn

Beacn is an API uptime monitoring tool. It periodically pings your endpoints, records response times and status codes, and gives you a dashboard to see what's up, what's down, and how fast things are responding. Monitoring data is scoped per user — sign up, and your endpoints are yours alone.

## Features

- **Automatic monitoring** — a background worker pings every registered endpoint on its own configurable interval and logs the result (status code, response time, timestamp), across all users
- **Authentication** — JWT-based signup/login; every endpoint you add is tied to your account, and only you can see or manage it
- **Dashboard** — at-a-glance KPI strip (total endpoints, incidents, overall uptime %, average response time) plus a table of all *your* monitored endpoints
- **Endpoint detail view** — response-time history as a line chart, plus a table of recent pings for that specific endpoint
- **Full CRUD** — add, edit, and remove monitored endpoints directly from the UI, with the dashboard updating instantly (no page reload)

## Tech stack

**Backend**
- FastAPI
- PostgreSQL + SQLAlchemy (ORM)
- Alembic (database migrations)
- `argon2-cffi` for password hashing, `PyJWT` for token issuance/verification
- A background worker process that pings all registered endpoints (across all users) on a fixed interval and persists results

**Frontend**
- React + Vite
- React Router for client-side routing, including auth-protected routes
- Recharts for the response-time graph
- Plain CSS with custom properties for the design system (no Tailwind/CSS framework)

## Architecture

```
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│   React     │  HTTP  │   FastAPI    │  SQL   │  PostgreSQL │
│  (Vite)     │◄──────►│   backend    │◄──────►│             │
└─────────────┘        └──────────────┘        └─────────────┘
                              ▲
                              │ writes ping results
                        ┌──────────────┐
                        │  Background  │
                        │    worker    │──► pings every endpoint
                        └──────────────┘     every N seconds
```

The frontend never talks to the database directly — everything goes through the FastAPI REST API. Every request to a protected route carries a JWT in the `Authorization: Bearer <token>` header; the backend verifies it statelessly (no DB lookup for the check itself) and scopes all queries to the authenticated user. The background worker runs independently of any user request and isn't scoped to a user — it continuously polls every endpoint in the system and writes results, so ping history keeps accumulating even with no one using the dashboard.

## API endpoints

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | `/auth/signup` | Create an account, returns an access token | No |
| POST | `/auth/login` | Log in, returns an access token | No |
| GET | `/endpoints/` | List your monitored endpoints | Yes |
| POST | `/endpoints/` | Add a new endpoint | Yes |
| GET | `/endpoints/{id}` | Get a single endpoint's details | Yes |
| PUT | `/endpoints/{id}` | Update an endpoint | Yes |
| DELETE | `/endpoints/{id}` | Remove an endpoint | Yes |
| GET | `/endpoints/{id}/pings` | Get all ping results for one endpoint | Yes |
| GET | `/endpoints/kpi` | Get aggregate dashboard stats for your endpoints (uptime %, incidents, avg response time) | Yes |

## Running locally

**Backend**

```bash
# from the backend directory
python -m venv venv
venv\Scripts\activate        # or `source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt

# set up your database connection and secret key
cp .env.example .env          # then fill in real values, including SECRET_KEY for JWT signing

alembic upgrade head           # run migrations
uvicorn main:app --reload      # starts the API on localhost:8000
```

**Frontend**

```bash
# from the frontend directory
npm install
npm run dev                    # starts the app on localhost:5173
```

The frontend expects the backend to be running at `http://localhost:8000` and CORS to allow `http://localhost:5173`.

On first use, sign up for an account at `/signup` — you'll be logged in automatically and redirected to the dashboard.

## What's next (v2, continued)

- ~~Authentication — protected routes so monitoring data is scoped per user~~ ✅ Done
- Per-endpoint uptime % and response-time stats on the detail page (currently only computed as a system-wide aggregate per user)
- Configurable alerting when an endpoint goes down
- Sparkline trend indicators in the dashboard table
