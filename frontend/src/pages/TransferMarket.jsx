import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import api from "../api/axiosInstance";

export default function TransferMarket() {

  const [filters, setFilters] = useState({
    team: "",
    player: "",
    maxPrice: "",
  });

  const [searchParams, setSearchParams] = useState(filters);
  const [message, setMessage] = useState(null);

  const { data: players = [], isLoading, isError } = useQuery({
    queryKey: ["transferList", searchParams],
    queryFn: async () => {
      const params = {};
      if (searchParams.team) params.team = searchParams.team;
      if (searchParams.player) params.player = searchParams.player;
      if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
      const res = await api.get("/transfer", { params });
      return res.data;
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
      setSearchParams(filters);
      setTimeout(() => activeInput.focus(), 0);
    }
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
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#9333ea", mb: 2 }}>
        Transfer Market
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
          onClick={() => setSearchParams(filters)}
          sx={{ bgcolor: "#9333ea", color: "white", "&:hover": { bgcolor: "#7e22ce" } }}
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
                Price: ${player.price.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team: {player.team.name}
              </Typography>
              <Typography sx={{ color: "#ea580c", fontWeight: "bold" }}>
                On Sale for ${player.askingPrice?.toLocaleString() || "?"}
              </Typography>

            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
