import jwt from "jsonwebtoken";

// JWT generate karne ke liye function banaya hai
export const generateToken = (payload, secret, expiry) => {
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

// JWT verify karne ke liye function banaya hai
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret); // Token valid hai ya expired,
    //  check karega
  } catch (err) {
    throw new Error("Invalid or expired token"); // Agar error aaye toh
    //  message dega
  }
};
