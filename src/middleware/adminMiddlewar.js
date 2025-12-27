const jwt = require("jsonwebtoken");
const User = require("../schema/UserSchema");

const adminMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(403).json({ message: "No token provided" });
    const token = auth.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select("-password");
    if (!user) return res.status(403).json({ message: "User not found" });
    if(user.role !=='ADMIN') return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminMiddleware;
