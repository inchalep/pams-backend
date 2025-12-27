const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();
const authMiddlewar = require("../middleware/authMiddlewar");
const { adoptionValidator } = require("../validators/adopt.validator");
const { adoptionController } = require("../controllers");

router.post(
  "/adoptRequest",
  authMiddlewar,
  validate(adoptionValidator),
  adoptionController.adoptRequest
);

router.get(
  "/withdrowRequest/:petId",
  authMiddlewar,
  adoptionController.withdrowRequest
);

router.get(
  "/usersAdoptRequest",
  authMiddlewar,
  adoptionController.usersAdoptRequest
);

router.get(
  "/updateStatus/:petId",
  authMiddlewar,
  adoptionController.updateRequest
);

module.exports = router;
