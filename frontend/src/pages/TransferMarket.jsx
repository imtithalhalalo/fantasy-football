import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Divider,
} from "@mui/material";

export default function TransferMarket() {

  const [filters, setFilters] = useState({
    team: "",
    player: "",
    maxPrice: "",
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
      setTimeout(() => activeInput.focus(), 0);
    }
  };


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

      </Stack>
    </Box>
  );
}
