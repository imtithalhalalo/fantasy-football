import { useState, useEffect } from "react";
import Login from "./pages/Login";
import TeamDashboard from "./pages/TeamDashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return loggedIn ? (
    <TeamDashboard />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}
