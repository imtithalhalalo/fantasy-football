import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Stack,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import api from "../api/axiosInstance";
import { useDebounce } from "../hooks/useDebounce";
import confetti from "canvas-confetti";

export default function TransferMarket() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    team: "",
    player: "",
    maxPrice: "",
  });

  const debouncedFilters = useDebounce(filters, 500);

  const [message, setMessage] = useState(null);
  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await api.get("/team");
      return res.data;
    },
  });

  const {
    data: players = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transferList", debouncedFilters],
    queryFn: async () => {
      const params = {};
      if (debouncedFilters.team) params.team = debouncedFilters.team;
      if (debouncedFilters.player) params.player = debouncedFilters.player;
      if (debouncedFilters.maxPrice)
        params.maxPrice = debouncedFilters.maxPrice;
      const res = await api.get("/transfer", { params });
      return res.data;
    },
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const buyMutation = useMutation({
    mutationFn: async (playerId) => {
      await api.post(`/transfer/buy/${playerId}`);
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "🎉 Player bought successfully!" });
      queryClient.invalidateQueries({ queryKey: ["transferList"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || "Failed to buy player";
      setMessage({ type: "error", text: errMsg });
    },
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const activeInput = e.target;
      queryClient.invalidateQueries(["transferList", filters]);
      setTimeout(() => activeInput.focus(), 0);
    }
  };

  const handleConfirmBuy = () => {
    if (!selectedPlayer) return;
    buyMutation.mutate(selectedPlayer.id);
    setSelectedPlayer(null);
  };

  if (isLoading)
    return (
      <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh" }}>
        <Typography>Loading transfer market...</Typography>
      </Box>
    );
  if (isError)
    return (
      <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh" }}>
        <Typography>Error loading players</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#9333ea" }}>
          Transfer Market
        </Typography>

        <Link
          component={RouterLink}
          to="/team"
          sx={{
            color: "#9333ea",
            fontWeight: "bold",
            textDecoration: "none",
            "&:hover": {
              color: "#7e22ce",
              textDecoration: "underline",
            },
          }}
        >
          Go to My Team →
        </Link>
      </Box>
      <Typography variant="h6" sx={{ mb: 1, color: "#555" }}>
        Budget: ${team.budget.toLocaleString()}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Team"
          name="team"
          value={filters.team}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size="small"
        />
        <TextField
          label="Player"
          name="player"
          value={filters.player}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size="small"
        />
        <TextField
          label="Max Price"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size="small"
        />
        <IconButton
          onClick={() =>
            queryClient.invalidateQueries(["transferList", filters])
          }
          sx={{
            bgcolor: "#9333ea",
            color: "white",
            "&:hover": { bgcolor: "#7e22ce" },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Stack>

      {message && (
        <Alert
          severity={message.type}
          onClose={() => setMessage(null)}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={2}>
        {players.length === 0 && (
          <Typography>No players found matching filters</Typography>
        )}

        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                bgcolor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {player.name} ({player.position})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team: {player.team.name}
              </Typography>
              <Typography sx={{ color: "#ea580c", fontWeight: "bold" }}>
                On Sale for ${player.askingPrice?.toLocaleString() || "?"}
              </Typography>

              <Button
                sx={{
                  mt: 1,
                  bgcolor: "#9333ea",
                  "&:hover": { bgcolor: "#9233eaa8" },
                }}
                variant="contained"
                disabled={buyMutation.isLoading}
                onClick={() => setSelectedPlayer(player)}
              >
                Buy
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TODO: move to separate component */}
      <Dialog
        open={!!selectedPlayer}
        fullWidth
        maxWidth="sm"
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setSelectedPlayer(null);
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          Confirm Purchase
          <IconButton
            aria-label="close"
            onClick={() => setSelectedPlayer(null)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPlayer && (
            <>
              <Typography>
                Are you sure you want to buy{" "}
                <strong>{selectedPlayer.name}</strong>?
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Original Price:{" "}
                <strong>${selectedPlayer.askingPrice.toLocaleString()}</strong>
              </Typography>
              <Typography sx={{ color: "green", mt: 1 }}>
                Discounted Price (95%):{" "}
                <strong>
                  ${(selectedPlayer.askingPrice * 0.95).toLocaleString()}
                </strong>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmBuy}
            variant="contained"
            sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
          >
            Confirm & Buy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
