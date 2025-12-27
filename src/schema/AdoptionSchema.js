const { default: mongoose } = require("mongoose");

const adoptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adoptions", adoptionSchema);
