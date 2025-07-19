import { Formik, Form } from "formik";
import axios from "axios";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import LoginSchema from "./utils/LoginSchema";
 import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
              const res = await axios.post("http://localhost:5000/auth", values);
              localStorage.setItem("token", res.data.token);
              toast(res.data.isNew
                ? "Registered successfully!"
                : "Logged in successfully!")
            } catch (err) {
              toast("Error: " + err.response?.data?.message || "Something went wrong")
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
              {/* Email */}
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              {/* Password */}
              <TextField
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Submit"}
              </Button>
              
              <ToastContainer />
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
