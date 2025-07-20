import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import TeamDashboard from "./pages/TeamDashboard";
import TransferMarket from "./pages/TransferMarket";
import Login from "./pages/Login";

const drawerWidth = 240;

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
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#9333ea",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Fantasy Football
          </Typography>

          <List>
            <ListItemButton
              selected={selectedTab === "team"}
              onClick={() => setSelectedTab("team")}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "#7e22ce",
                },
              }}
            >
              <ListItemText primary="My Team" />
            </ListItemButton>

            <ListItemButton
              selected={selectedTab === "transfer"}
              onClick={() => setSelectedTab("transfer")}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "#7e22ce",
                },
              }}
            >
              <ListItemText primary="Transfer Market" />
            </ListItemButton>
          </List>
        </Box>

        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "#e9d5ff",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          px: 3, py: 0,
          bgcolor: "white",
          overflowY: "auto",
        }}
      >
        {selectedTab === "team" && <TeamDashboard />}
        {selectedTab === "transfer" && <TransferMarket />}
      </Box>
    </Box>
  );
}
