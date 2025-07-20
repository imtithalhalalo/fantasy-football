import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field } from "formik";
import SalePriceSchema from "../utils/SalePriceSchema";

export default function SalePriceDialog({ open, player, onClose, onConfirm }) {
  if (!player) return null;

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
        Set Asking Price
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

      <DialogContent dividers>
        <Typography sx={{ mb: 2 }}>
          Enter an asking price for <strong>{player.name}</strong>
        </Typography>

        <Formik
          initialValues={{ askingPrice: "" }}
          validationSchema={SalePriceSchema}
          onSubmit={(values) => {
            onConfirm(values.askingPrice);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                name="askingPrice"
                as={TextField}
                label="Asking Price"
                type="number"
                fullWidth
                error={touched.askingPrice && Boolean(errors.askingPrice)}
                helperText={touched.askingPrice && errors.askingPrice}
              />

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={onClose} color="inherit">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
                >
                  Confirm Sale
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
