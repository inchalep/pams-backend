const yup = require("yup");

const petValidator = yup.object({
  name: yup
    .string()
    .required("Pet name is required")
    .min(2, "Pet name must be at least 2 characters"),

  species: yup
    .string()
    .required("Species is required")
    .oneOf(["Dog", "Cat", "Bird", "Other"], "Invalid species"),

  breed: yup
    .string()
    .required("Breed is required")
    .min(2, "Breed must be at least 2 characters"),

  age: yup
    .number()
    .required("Age is required")
    .min(0, "Age cannot be negative")
    .max(50, "Age seems invalid"),

  description: yup
    .string()
    .optional()
    .max(500, "Description must be under 500 characters"),

  image: yup.string().optional().url("Image must be a valid URL"),

  status: yup
    .string()
    .oneOf(["AVAILABLE", "PENDING", "ADOPTED"])
    .default("AVAILABLE"),
});

const petUpdateValidator = yup.object({
  name: yup
    .string()
    .min(2, "Pet name must be at least 2 characters")
    .optional(),

  species: yup
    .string()
    .oneOf(["Dog", "Cat", "Bird", "Other"], "Invalid species")
    .optional(),

  breed: yup.string().min(2, "Breed must be at least 2 characters").optional(),

  age: yup
    .number()
    .min(0, "Age cannot be negative")
    .max(50, "Age seems invalid")
    .optional(),

  description: yup
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),

  image: yup.string().url("Image must be a valid URL").optional(),

  status: yup.string().oneOf(["AVAILABLE", "PENDING", "ADOPTED"]).optional(),
});

module.exports = {
  petValidator,
  petUpdateValidator,
};
