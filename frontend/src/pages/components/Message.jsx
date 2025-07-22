import { Box, Typography, Button } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export default function Message({ message, onRetry }) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <SportsSoccerIcon
        sx={{
          fontSize: 80,
          color: "#9333ea",
          mb: 2,
        }}
      />

      <Typography variant="h4" sx={{ color: "#9333ea", fontWeight: "bold" }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            mt: 3,
            bgcolor: "#9333ea",
            "&:hover": { bgcolor: "#7e22ce" },
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
