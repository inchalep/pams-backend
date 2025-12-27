const yup = require("yup");

const adoptionValidator = yup.object({
  user: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  pet: yup
    .string()
    .required("Pet ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid pet ID"),
  status: yup
    .string()
    .oneOf(["PENDING", "APPROVED", "REJECTED"])
    .default("PENDING"),
});
module.exports = {
  adoptionValidator,
};
