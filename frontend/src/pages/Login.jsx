import { Formik, Form } from "formik";
import footballImage from "../assets/football.jpeg";
import axios from "axios";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import LoginSchema from "./utils/LoginSchema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onLogin }) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", md: "70%" },
          height: { xs: "auto", md: "70%" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${footballImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "100%",
          }}
        />
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
            Login / Register
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const res = await axios.post(
                  "http://localhost:5000/auth",
                  values
                );
                localStorage.setItem("token", res.data.token);

                toast(
                  res.data.isNew
                    ? "Registered successfully!"
                    : "Logged in successfully!"
                );

                onLogin();
              } catch (err) {
                toast(
                  "Error: " +
                    (err.response?.data?.message || "Something went wrong")
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <TextField
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />

                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: "#9333ea",
                    "&:hover": { bgcolor: "#7e22ce" },
                  }}
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </Button>
                <ToastContainer />
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
}
