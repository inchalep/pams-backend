const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/UserSchema");
const { sendSuccess } = require("../utils/common");
const userSignUp = async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(req.body.password, 10);

    const dbData = await User.create({ ...req.body, password: hashed });

    return res.status(200).json({
      success: 201,
      data: dbData,
      message: "User created successfully.",
    });
  } catch (error) {
    return res.status(401).json({
      data: null,
      success: false,
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.query;
    const user = await User.findOne({
      email,
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({
      success: true,
      data: { token, id: user._id, email: user.email, name: user.name, role: user.role },
      message: "Login successfully.",
    });
  } catch (error) {
    res.status(401).json({
      data: null,
      success: false,
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, {
      password: 0,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({
      success: true,
      data: { token, id: user._id, email: user.email, name: user.name },
      message: "Account create successfully",
    });
  } catch (error) {
    return res.status(401).json({
      data: null,
      success: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let user = await User.findById(id, {
      password: 0,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.name = name;
    user = await user.save();
    return res.status(200).json({
      status: 200,
      data: user,
      message: "User Updated successfully",
    });
  } catch (error) {
    return res.status(401).json({
      data: null,
      success: false,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, {
        statusCode: 403,
        error: "ID is required",
      });
    }
    await User.findByIdAndDelete(id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 501,
      error: error.message,
    });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getUser,
  updateUser,
  deleteUser,
};
