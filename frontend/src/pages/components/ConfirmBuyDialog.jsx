import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ConfirmBuyDialog({
  open,
  player,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
        Confirm Purchase
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        {player && (
          <>
            <Typography>
              Are you sure you want to buy <strong>{player.name}</strong>?
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Original Price:{" "}
              <strong>${player.askingPrice.toLocaleString()}</strong>
            </Typography>
            <Typography sx={{ color: "green", mt: 1 }}>
              Discounted Price (95%):{" "}
              <strong>
                ${(player.askingPrice * 0.95).toLocaleString()}
              </strong>
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
        >
          {isLoading ? "Processing..." : "Confirm & Buy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
