import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string().min(4, "Too Short!").required("Password is Required"),
});

export default LoginSchema;