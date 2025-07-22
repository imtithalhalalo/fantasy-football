import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  IconButton,
  Fab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TeamDashboard from "./pages/TeamDashboard";
import TransferMarket from "./pages/TransferMarket";
import Login from "./pages/Login";

const drawerWidth = 240;

export default function AppLayout() {
  const [selectedTab, setSelectedTab] = useState("team");
  const [loggedIn, setLoggedIn] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(true);

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

        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{
            color: "white",
            "&:hover": { background: "rgba(255,255,255,0.1)" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
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

      {!drawerOpen && (
        <Fab
          color="primary"
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 20,
            left: 30,
            bgcolor: "#9333ea",
            "&:hover": { bgcolor: "#7e22ce" },
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      <Box
        sx={{
          flexGrow: 1,
          ml: drawerOpen ? `${drawerWidth}px` : "0px",
          transition: "margin 0.3s ease",
          bgcolor: "white",
          alignContent: 'center',
          overflowY: "auto",
          pl: 10,
        }}
      >
        {selectedTab === "team" && <TeamDashboard />}
        {selectedTab === "transfer" && <TransferMarket />}
      </Box>
    </Box>
  );
}
