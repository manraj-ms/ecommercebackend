import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";

// Register user => register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
      return next({
        status: 400,
        message: "Please enter all required fields."
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return next({
        status: 400,
        message: "Please enter a valid email address."
      });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next({
        status: 400,
        message: "This email ID is already in use."
      });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).sendResponse("User has been registered.", {
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user => login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({
        status: 400,
        message: "Please enter email and password."
      });
    }

    // Find user in the database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        status: 401,
        message: "Invalid email or password."
      });
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next({
        status: 401,
        message: "Invalid email or password."
      });
    }

    sendToken(user, res);
  } catch (error) {
    next(error);
  }
};

// Logout user => logout
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).sendResponse("Logged Out", {});
  } catch (error) {
    next(error);
  }
};

// Get all Users => admin/users
export const allUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).sendResponse("All users retrieved successfully", { users });
  } catch (error) {
    next(error);
  }
};
