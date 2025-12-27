const express = require("express");
const { userSchema } = require("../validators/user.validator");
const validate = require("../middleware/validate");
const router = express.Router();
const authMiddlewar = require("../middleware/authMiddlewar");
const { userController } = require("../controllers");

router.post("/signUp", validate(userSchema), userController.userSignUp);

router.get("/login", userController.userLogin);

router.get("/getuser/:id", authMiddlewar, userController.getUser);

router.patch("/updateUser/:id", authMiddlewar, userController.updateUser);
router.delete("/deleteUser/:id", authMiddlewar, userController.deleteUser);

module.exports = router;
