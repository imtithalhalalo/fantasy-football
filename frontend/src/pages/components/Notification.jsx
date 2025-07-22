import { useState, useEffect, useRef } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography, Snackbar, Alert } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosInstance";

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [toastMsg, setToastMsg] = useState(""); 
  const [toastOpen, setToastOpen] = useState(false);
  const prevCount = useRef(0);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
    refetchInterval: 5000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (prevCount.current === 0) {
      prevCount.current = notifications.length;
      return;
    }

    if (notifications.length > prevCount.current) {
      const newest = notifications[0]; 
      if (newest) {
        new Audio("/notification.wav").play();

        setToastMsg(newest.message);
        setToastOpen(true);
      }
    }

    prevCount.current = notifications.length;
  }, [notifications]);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "white" }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {notifications.length === 0 && <MenuItem>No notifications</MenuItem>}
        {notifications.map((n) => (
          <MenuItem key={n.id}>
            <Typography variant="body2">{n.message}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000} 
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="info"
          onClose={() => setToastOpen(false)}
          sx={{ bgcolor: "white", color: "#9333ea" }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
