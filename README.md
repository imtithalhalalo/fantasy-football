# Fantasy Football

- Users should be able to register/login using an email and password.
- When a user registers, they receive a team with: 
- A budget of $5,000,000 for transfers.
- Filter transfers by team name, player name, and price. 
- Add/remove their players from the transfer list and set a specific 
asking price. 
- Buy players from other teams at 95% of their asking price. 
- Teams should have between 15-25 players at all times.

---

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** and **npm**  
  To install or update npm:
  ```sh
  npm install npm@latest -g
  ```

---

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/your-username/fantasy-football.git
```

---

## Frontend Setup (React)

1. Navigate to the frontend directory:
   ```sh
   cd fantasy-football/frontend
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

The frontend should now be running on [http://localhost:5173](http://localhost:5173) (or whichever port your setup uses).

---

## Backend Setup (Node.js + Prisma)

1. Navigate to the backend directory:
   ```sh
   cd ../backend
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Run the backend server:
   ```sh
   node src/index.js
   ```

4. Open Prisma Studio (optional, for managing your database):
   ```sh
   npx prisma studio
   ```

---

## Database Setup 

If you are using Prisma with a database, initialize it with:

```sh
npx prisma migrate dev
```

Make sure your `.env` file contains the correct `DATABASE_URL`.

## Environment Variables

Make sure to add your `.env` file
