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

# Progress

## Backend & Frontend Setup
- Backend Setup (Adding folders and node modules)               ~30 mins
- Frontend Setup                                                ~30 mins

## Authentication & Schema
- Login and Registeration                                       ~2 hrs
- User and Team Schema                                          ~30 mins
- Updating Team                                                 ~10 mins
- Adding Player Schema                                          ~20 mins
- Auto creating team and players                                ~30 mins

## Backend Routes & Middleware
- Creating Teams Route And Auth middleware                      ~1 hr
- Updating Login and Team Dashboard                             ~30 mins
- Adding Apis                                                   ~1 hr
    - List players                                              ~15 mins
    - Return one player                                         ~15 mins
    - Buying player from another team                           ~20 mins
        - conditions (team size, budget)                                            ~10 mins
        - updating buyer team and seller team              ~10 mins
## Team Dashboard & Sidebar
- Adding SideBar with logout button                                         ~2 hr
- Updating Team Dashboard to show cards with button to allow sale ~30 mins
-  Drawer/ Sidebar layout                                   ~1 hr

## Market Transfer & UI Enhancements
- Filter Api                                                ~30 mins
- Adding frontend filters                                   ~ 1hr
- Adding loading skeleton for team dashboard  in Market Transfer              ~15 mins
- Adding buy button in Market Transfer                      ~20 mins
- Sale Asking Price Dialog                                  ~30 mins

## UI Polishing
- Fixing Login/Register style                               ~40 mins
- SideBar/ drawer to close and reopen                       ~20 mins
- Price of the original should not show for the buyer       ~5 mins
- Another color for the paid players and toast message for bought from and bought At                                ~35 mins
- Celebration when the user buy something successfully     15 mins

## Notifications
- Notification if the user bought or sell                    ~2 hrs
    - Updating schema                                        ~30 mins
    - Adding api to retreive notifications                   ~45 mins
    - Create notification in buy                             ~10 mins

- Add budget to transfer market                              ~10 mins
- Adding condition to disable button for sale if user have only 15 players ~12 mins

- Remove notification (on mark as unread)                   ~30 mins
- back and forward links in the screens                     ~20 mins                      


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

Make sure to add your `.env` file and JWT_SECRET
```sh
DATABASE_URL="file:./dev.db" (change according to db link)
PORT=5000
JWT_SECRET='create-any-jwt'
```
