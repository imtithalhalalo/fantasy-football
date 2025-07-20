import * as Yup from "yup";

const SalePriceSchema = Yup.object().shape({
  askingPrice: Yup.number()
    .min(100000, "Minimum price is $100,000")
    .max(5000000, "Maximum price is $5,000,000")
    .required("Asking price is required"),
});

export default SalePriceSchema;
