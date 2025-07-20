import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import TeamSkeleton from "./skeletons/TeamDashBoardSkeleton";

export default function TeamDashboard() {
  const queryClient = useQueryClient();

  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await api.get("/team");
      return res.data;
    },
  });

  const toggleSaleMutation = useMutation({
    mutationFn: async ({ playerId, isForSale }) => {
      if (isForSale) {
        await api.delete(`/transfer/${playerId}`);
      } else {
        await api.post(`/transfer/${playerId}`, { askingPrice: 800000 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  const groupPlayersByPosition = (players) => {
    return players.reduce((groups, player) => {
      if (!groups[player.position]) {
        groups[player.position] = [];
      }
      groups[player.position].push(player);
      return groups;
    }, {});
  };

  if (isLoading) {
    return (
      <TeamSkeleton />
    );
  }

  if (!team) return <Typography>No team found</Typography>;

  const groupedPlayers = groupPlayersByPosition(team.players);

  return (
    <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#9333ea" }}>
        {team.name}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, color: "#555" }}>
        Budget: ${team.budget.toLocaleString()}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#777" }}>
        Total Players: {team.players.length}
      </Typography>
      {Object.entries(groupedPlayers).map(([position, players]) => (
        <Box key={position} sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "#4c1d95",
              fontWeight: "bold",
              borderLeft: "4px solid #9333ea",
              pl: 1.5,
            }}
          >
            {position === "GK"
              ? "Goalkeepers"
              : position === "DEF"
              ? "Defenders"
              : position === "MID"
              ? "Midfielders"
              : "Attackers"}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
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

                  {player.isForSale ? (
                    <Typography sx={{ color: "#ea580c", fontWeight: "bold" }}>
                      On Sale for ${player.askingPrice?.toLocaleString() || "?"}
                    </Typography>
                  ) : (
                    <Typography color="gray">Not for sale</Typography>
                  )}

                  <Button
                    sx={{
                      mt: 1,
                      bgcolor: player.isForSale ? "#dc2626" : "#9333ea",
                      "&:hover": {
                        bgcolor: player.isForSale ? "#b91c1c" : "#7e22ce",
                      },
                    }}
                    variant="contained"
                    onClick={() =>
                      toggleSaleMutation.mutate({
                        playerId: player.id,
                        isForSale: player.isForSale,
                      })
                    }
                    disabled={toggleSaleMutation.isLoading}
                  >
                    {player.isForSale ? "Remove from Sale" : "Put on Sale"}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
