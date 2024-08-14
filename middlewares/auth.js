import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next({
        status: 401,
        message: "Login first to access this resource."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next({
        status: 403,
        message: `Role (${req.user.role}) is not allowed to access this resource.`
      });
    }
    next();
  };
};
