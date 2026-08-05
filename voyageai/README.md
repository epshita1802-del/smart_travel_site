# VoyageAI — Smart Tour Booking with AI-Based Travel Recommendations

A full-stack MERN application for browsing destinations, booking guided tours, and generating
AI-powered travel recommendations (destinations, budgets, itineraries, packing lists, tips, and
nearby attractions) using the OpenAI API.

## Tech Stack

**Frontend:** React 18 (Vite), Tailwind CSS, React Router DOM, Axios, Framer Motion, React Icons, react-hot-toast
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, bcryptjs, Multer, dotenv, CORS
**AI:** OpenAI API (`gpt-4o-mini`)

## Project Structure

```
voyageai/
├── backend/
│   ├── config/          # DB connection, Multer config
│   ├── controllers/     # Route handlers (auth, users, tours, destinations, bookings, reviews, ai)
│   ├── middleware/      # JWT auth, admin guard, error handling, async wrapper
│   ├── models/          # Mongoose schemas (User, Tour, Destination, Booking, Review)
│   ├── routes/          # Express routers
│   ├── utils/           # Token generator, database seeder
│   ├── uploads/         # Uploaded images (served statically)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, TourCard, DestinationCard, route guards, etc.
│   │   ├── context/      # AuthContext (JWT session state)
│   │   ├── hooks/        # useDebounce, useDocumentTitle
│   │   ├── pages/         # Home, Destinations, Packages, AI Planner, Dashboard, Admin, etc.
│   │   ├── services/      # Axios-based API service modules
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── package.json          # Root workspace scripts (runs both apps together)
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm 9+
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string
- An **OpenAI API key** (only required for the AI Planner features — the rest of the app works without it)

## Getting Started

### 1. Install dependencies

From the project root (this installs both `backend` and `frontend` via npm workspaces):

```bash
npm install
```

### 2. Configure environment variables

Both `backend/.env` and `frontend/.env` are already included with working local defaults. Review and update:

**`backend/.env`**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/voyageai
JWT_SECRET=replace_with_a_long_random_string
OPENAI_API_KEY=sk-your-openai-api-key-here
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

> The AI Planner endpoints will return a 503 error until a valid `OPENAI_API_KEY` is set — every other
> feature (auth, browsing, booking, favorites, reviews, admin panel) works independently of it.

### 3. Start MongoDB

Make sure a MongoDB instance is running locally, or point `MONGO_URI` to your MongoDB Atlas cluster.

### 4. (Optional) Seed demo data

Creates an admin account plus sample destinations and tours:

```bash
npm run seed
```

Default admin login (override via `backend/.env`): `admin@voyageai.com` / `Admin@12345`

### 5. Run the app

From the project root:

```bash
npm run dev
```

This concurrently starts:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Features

### Users
- Register / Login / Logout (JWT-based auth)
- Edit profile with avatar upload
- Browse, search and filter tours & destinations
- Book tours, cancel bookings, view booking history
- Save favorite tours
- Leave reviews on tours after booking

### AI Planner
- Destination recommendations based on interests, style and budget
- Detailed budget breakdowns
- Day-wise itinerary generation
- Packing checklists
- Local travel tips
- Nearby attraction discovery

### Admin
- Dashboard with platform-wide stats
- Manage users (role, active status, delete)
- Manage destinations (create, edit, delete, image upload)
- Manage tours (create, edit, delete, itinerary, image upload)
- Manage bookings (status & payment status updates)
- Manage reviews (delete)

## REST API Overview

All endpoints are prefixed with `/api`.

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `PUT /users/profile`, `GET/PUT /users/favorites`, `GET/PUT/DELETE /users` (admin) |
| Destinations | `GET /destinations`, `GET /destinations/:slug`, `POST/PUT/DELETE /destinations` (admin) |
| Tours | `GET /tours`, `GET /tours/:slug`, `POST/PUT/DELETE /tours` (admin) |
| Bookings | `POST /bookings`, `GET /bookings/my`, `PUT /bookings/:id/cancel`, `GET /bookings` (admin), `PUT /bookings/:id/status` (admin) |
| Reviews | `POST /reviews`, `GET /reviews/tour/:tourId`, `GET /reviews` (admin), `DELETE /reviews/:id` |
| AI | `POST /ai/destination-recommendation`, `POST /ai/budget-recommendation`, `POST /ai/itinerary`, `POST /ai/packing-checklist`, `POST /ai/travel-tips`, `POST /ai/nearby-attractions` |

## Building for Production

```bash
npm run build       # builds the frontend to frontend/dist
npm run dev:backend # or: cd backend && npm start
```

Serve `frontend/dist` with any static host (Vercel, Netlify, Nginx) and deploy the `backend/` folder
to a Node host (Render, Railway, EC2, etc.), pointing `VITE_API_URL` at your deployed API URL and
`CLIENT_URL` at your deployed frontend URL.

## License

MIT — free to use and modify for personal or commercial projects.
