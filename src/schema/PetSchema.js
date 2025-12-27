const { default: mongoose } = require('mongoose');

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    species: {
      type: String,
      require: true,
    },
    breed: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    image: {
      type: String,
      require: false,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "PENDING", "ADOPTED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pets", PetSchema);

