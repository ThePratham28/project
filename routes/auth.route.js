import { Router } from "express";
import {
	registerUser,
	userLogin,
	verifyRfTOken,
} from "../controllers/auth.controlller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", userLogin);

authRouter.post("/token", verifyRfTOken);

export default authRouter;
