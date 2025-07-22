import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  Fab,
  AppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TeamDashboard from "./pages/TeamDashboard";
import TransferMarket from "./pages/TransferMarket";
import Login from "./pages/Login";
import Notification from "./pages/components/Notification";

const drawerWidth = 240;

export default function AppLayout() {
  const [selectedTab, setSelectedTab] = useState("team");
  const [loggedIn, setLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#9333ea",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Fantasy Football
        </Typography>

        <Fab
          onClick={() => setDrawerOpen(false)}
          size="small"
          sx={{
            bgcolor: "#7e22ce",
            "&:hover": { bgcolor: "#6b21a8" },
          }}
        >
          <ChevronLeftIcon sx={{ color: "white" }} />
        </Fab>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <List>
          <ListItemButton
            selected={selectedTab === "team"}
            onClick={() => setSelectedTab("team")}
            sx={{
              color: "white",
              "&.Mui-selected": { backgroundColor: "#7e22ce" },
            }}
          >
            <ListItemText primary="My Team" />
          </ListItemButton>

          <ListItemButton
            selected={selectedTab === "transfer"}
            onClick={() => setSelectedTab("transfer")}
            sx={{
              color: "white",
              "&.Mui-selected": { backgroundColor: "#7e22ce" },
            }}
          >
            <ListItemText primary="Transfer Market" />
          </ListItemButton>
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
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
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* ✅ Drawer on left */}
      {drawerOpen && (
        <Drawer
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: "relative",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          ml: drawerOpen ? `${drawerWidth}px` : "0px",
          transition: "margin 0.3s ease",
          bgcolor: "white",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "white",
            color: "#333",
            boxShadow: "none",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Fab
              onClick={() => setDrawerOpen(!drawerOpen)}
              size="medium"
              sx={{
                bgcolor: "#9333ea",
                "&:hover": { bgcolor: "#7e22ce" },
              }}
            >
              <MenuIcon sx={{ color: "white" }} />
            </Fab>
            <Fab
              size="medium"
              sx={{
                bgcolor: "#9333ea",
                "&:hover": { bgcolor: "#7e22ce" },
              }}
            >
              <Notification />
            </Fab>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4 }}>
          {selectedTab === "team" && <TeamDashboard />}
          {selectedTab === "transfer" && <TransferMarket />}
        </Box>
      </Box>
    </Box>
  );
}
