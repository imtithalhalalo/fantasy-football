import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";

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



  if (isLoading) return <Typography>Loading team...</Typography>;
  if (!team) return <Typography>No team found</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{team.name}</Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Budget: ${team.budget.toLocaleString()}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Total Players: {team.players.length}
      </Typography>

      <Grid container spacing={2}>
        {team.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper sx={{ p: 2 }}>
              <Typography>
                <b>{player.name}</b> ({player.position})
              </Typography>
              <Typography>Price: ${player.price.toLocaleString()}</Typography>

              {player.isForSale ? (
                <Typography color="orange">
                  On Sale for ${player.askingPrice?.toLocaleString() || "?"}
                </Typography>
              ) : (
                <Typography color="gray">Not for sale</Typography>
              )}
            <Button
                sx={{ mt: 1 }}
                variant="contained"
                color={player.isForSale ? "error" : "primary"}
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
  );
}
