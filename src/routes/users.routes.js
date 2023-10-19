import { Router } from "express";
import passport from "passport";
import { postUser } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post('/register', passport.authenticate('register'), postUser )


export default userRouter