import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Grid } from "@mui/material";

export default function TeamDashboard() {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/team", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setTeam(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeam();
  }, []);

  if (!team) return <Typography>Loading team...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{team.name}</Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Budget: ${team.budget.toLocaleString()}
      </Typography>

      <Grid container spacing={2}>
        {team.players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Paper sx={{ p: 2 }}>
              <Typography><b>{player.name}</b></Typography>
              <Typography>Position: {player.position}</Typography>
              <Typography>Price: ${player.price.toLocaleString()}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
