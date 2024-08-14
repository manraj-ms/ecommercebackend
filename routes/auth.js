import express from "express"
import { registerUser, loginUser, logout, allUsers } from "../controllers/authControllers.js"
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"
const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

export default router