import { useState } from "react";
import { Box, Typography, Paper, Grid, Button, Divider } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import TeamSkeleton from "./skeletons/TeamDashBoardSkeleton";
import SalePriceDialog from "./components/SalePriceDialog";

export default function TeamDashboard() {
  const queryClient = useQueryClient();

  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await api.get("/team");
      return res.data;
    },
  });

  const addToSaleMutation = useMutation({
    mutationFn: async ({ playerId, askingPrice }) =>
      api.post(`/transfer/${playerId}`, { askingPrice }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });

  const removeFromSaleMutation = useMutation({
    mutationFn: async (playerId) => api.delete(`/transfer/${playerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  });

  const groupPlayersByPosition = (players) =>
    players.reduce((groups, player) => {
      if (!groups[player.position]) groups[player.position] = [];
      groups[player.position].push(player);
      return groups;
    }, {});

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleOpenDialog = (player) => setSelectedPlayer(player);
  const handleCloseDialog = () => setSelectedPlayer(null);

  if (isLoading) return <TeamSkeleton />;
  if (!team) return <Typography>No team found</Typography>;

  const groupedPlayers = groupPlayersByPosition(team.players);

  const handleConfirmSale = (askingPrice) => {
    if (!selectedPlayer) return;
    addToSaleMutation.mutate({
      playerId: selectedPlayer.id,
      askingPrice,
    });
    handleCloseDialog();
  };

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
                    onClick={() => {
                      if (player.isForSale) {
                        removeFromSaleMutation.mutate(player.id);
                      } else {
                        handleOpenDialog(player);
                      }
                    }}
                    disabled={
                      removeFromSaleMutation.isLoading ||
                      addToSaleMutation.isLoading
                    }
                  >
                    {player.isForSale ? "Remove from Sale" : "Put on Sale"}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <SalePriceDialog
        open={!!selectedPlayer}
        player={selectedPlayer}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmSale}
      />
    </Box>
  );
}
