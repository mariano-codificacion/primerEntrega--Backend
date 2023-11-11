import { Router } from "express";
import passport from "passport";
import { postUser } from "../controllers/user.controller.js";
import { generateUserErrorInfo } from "../service/errors/info.js";

const userRouter = Router()

userRouter.post('/register', (req, res, next) => {
    const { nombre, apellido, email, edad, contraseña } = req.body
    try {
        if (!nombre || !apellido || !email || !edad || !contraseña || !category) {
            CustomError.createError({
                name: "Product create error",
                cause: generateUserErrorInfo ({nombre, apellido, email, edad, contraseña}),
                message: "One or more properties were incomplete or not valid",
                code: EErrors.INVALID_USER_ERROR
            })
        }
    } catch (error) {
        next(error)
    }
},
    passport.authenticate('register'), postUser )

export default userRouter