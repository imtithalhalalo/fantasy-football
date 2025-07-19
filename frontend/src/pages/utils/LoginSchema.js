import * as Yup from "yup";

// ✅ Yup validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

export default LoginSchema;