import { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const prevCount = useRef(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);
      queryClient.invalidateQueries(["notifications"]);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "white" }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 500, maxHeight: 400 },
        }}
      >
        {notifications.length === 0 && <MenuItem>No notifications</MenuItem>}

        {notifications.map((n) => (
          <MenuItem
            key={n.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onClick={() => handleMarkAsRead(n.id)}
            >
              {!n.isRead && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#9333ea",
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: !n.isRead ? "bold" : "normal",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {n.message}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => handleMarkAsRead(n.id)}
              sx={{
                color: "#9333ea",
                "&:hover": { bgcolor: "rgba(147, 51, 234, 0.1)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
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
          onClick={() => navigate("/team")}
          sx={{
            bgcolor: "white",
            color: "#9333ea",
            cursor: "pointer",
            border: "1px solid #9333ea",
          }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
