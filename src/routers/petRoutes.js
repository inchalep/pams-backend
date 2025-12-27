const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();
const { petController } = require("../controllers");
const {
  petValidator,
  petUpdateValidator,
} = require("../validators/pet.validator");
const adminMiddleware = require("../middleware/adminMiddlewar");

router.post(
  "/addPet",
  adminMiddleware,
  validate(petValidator),
  petController.addPet
);

router.get("/getPet/:id", petController.getPet);
router.get("/getAllPets", petController.getAllPets);

router.patch(
  "/updatePet/:id",
  adminMiddleware,
  validate(petUpdateValidator),
  petController.updatePet
);
router.patch("/deletePet/:id", adminMiddleware, petController.deletePet);

module.exports = router;
