import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default function TeamDashboard() {
  const queryClient = useQueryClient();

  const { data: team, isLoading } = useQuery({
  queryKey: ["team"],
  queryFn: async () => {
    const res = await api.get("/team");
    return res.data;
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
               
              
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
