import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Stamuraiuser } from "../models/userModels.js"; // Changed to Stamuraiuser

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Stamuraiuser.findById(decodedToken?._id).select( // Changed to Stamuraiuser
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid Access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Access Token",
    });
  }
});
