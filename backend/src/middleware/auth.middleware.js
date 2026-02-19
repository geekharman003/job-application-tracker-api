import jwt, { decode } from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/index.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized - token is expired or invalid" });

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
      raw: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
