import { useState, useEffect } from "react";
import { Box, List, ListItemButton, ListItemText, Typography, Button } from "@mui/material";
import TeamDashboard from "./pages/TeamDashboard";
import TransferMarket from "./pages/TransferMarket";
import Login from "./pages/Login";

export default function AppLayout() {
  const [selectedTab, setSelectedTab] = useState("team");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: 240,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Fantasy Football
        </Typography>

        <List sx={{ flexGrow: 1 }}>
          <ListItemButton
            selected={selectedTab === "team"}
            onClick={() => setSelectedTab("team")}
          >
            <ListItemText primary="My Team" />
          </ListItemButton>

          <ListItemButton
            selected={selectedTab === "transfer"}
            onClick={() => setSelectedTab("transfer")}
          >
            <ListItemText primary="Transfer Market" />
          </ListItemButton>
        </List>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        {selectedTab === "team" && <TeamDashboard />}
        {selectedTab === "transfer" && <TransferMarket />}
      </Box>
    </Box>
  );
}
