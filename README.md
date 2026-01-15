# MERN Stack Investment Dashboard

A full-stack investment management application built with MongoDB, Express, React, and Node.js.

## Features

- User authentication (register/login)
- Investment management
- ROI (Return on Investment) tracking
- Referral system with multi-level income
- Daily ROI calculation via cron jobs
- Dashboard with investment statistics

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, TypeScript, Vite
- **Authentication**: JWT (JSON Web Tokens)
- **Scheduling**: node-cron for daily ROI calculations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thakurnischay/thakurnischay.git
cd "mern stack project"
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
cd ..
```

3. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_investments
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start MongoDB (if running locally)

## Running the Project

### Development Mode (Both servers)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:5173`

### Run Separately

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Investments
- `POST /api/investments` - Create new investment
- `GET /api/investments` - Get user investments

### Dashboard
- `GET /api/dashboard` - Get dashboard data (requires auth)

### Referrals
- `GET /api/referrals/tree` - Get referral tree (requires auth)

## Project Structure

```
mern stack project/
├── backend/
│   ├── server.js
│   └── src/
│       ├── models/       # MongoDB models
│       ├── routes/       # API routes
│       ├── services/     # Business logic
│       ├── utils/        # Utility functions
│       └── cron/         # Scheduled jobs
├── frontend/
│   ├── src/
│   │   ├── modules/      # React components
│   │   └── main.tsx      # Entry point
│   └── vite.config.ts
└── package.json
```

## Notes

- The server will start even if MongoDB is not connected, but database features won't work
- Make sure MongoDB is running for full functionality
- Update `MONGO_URI` in `.env` to use MongoDB Atlas if preferred

## License

ISC
