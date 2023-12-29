import { Router } from "express";
import passport from "passport";
import { postUser, deleteUser, getUsers, deleteInactiveUsers } from "../controllers/user.controller.js";
import { generateUserErrorInfo } from "../service/errors/info.js";
import CustomError from "../service/errors/customError.js";
import EErrors from "../service/errors/enums.js";
import { sendRecoveryEmail } from "../config/nodemailer.js";
import crypto from 'crypto'
import userModel from "../models/users.models.js";
import { createHash, validatePassword } from '../utils/bcrypt.js';
import logger from "../utils/logger.js";
import { passportError,  authorization } from "../utils/messageErrors.js";

const userRouter = Router()

const recoveryLinks = {}
userRouter.post('/recovery-password', async (req, res) => {

    const { email } = req.body
    
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            logger.error(`Usuario no encontrado: ${email}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
        }

        const token = crypto.randomBytes(20).toString('hex') //Token unico con el fin de no utilizar JWT para algo simple

        recoveryLinks[token] = { email, timestamp: Date.now() }

        const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`
        console.log(token)
        sendRecoveryEmail(email, recoveryLink)

        res.status(200).send('Correo de recuperacion enviado correctamente')
    } catch (error) {
        res.status(500).send('Error al enviar correo de recuperacion: ', error)
    }
})

userRouter.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params
    const { newPassword, oldPassword } = req.body
    try {
        //Verifico que el token es valido y no ha expirado (1 hora)
        const linkData = recoveryLinks[token]
        console.log(token)
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            const { email } = linkData

            console.log(email)
            console.log(newPassword)
            console.log(oldPassword)

            const user = await userModel.findOne({ email });
            if (!user) {
                logger.error(`Usuario no encontrado: ${email}`);
                return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
            }
              //Consulto si la nueva contraseña es distinta a la antigua
            const password = validatePassword(newPassword, user.password);
            if (password) {
                logger.error(`La nueva contraseña no puede ser igual a la anterior`);
                return res.status(400).send({ error: `La nueva contraseña no puede ser igual a la anterior` });
            }

            // Update the users password in the database
            user.password = createHash(newPassword);
            await user.save();

            delete recoveryLinks[token]
            logger.info(`Password actualizado correctamente para el usuario ${email}`);
            res.status(200).send('Contraseña modificada correctamente')

        } else {
            res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
        }
    } catch (error) {
        res.status(500).send('Error al cambiar contraseña de cliente: ', error)
    }

})


userRouter.post('/register', (req, res, next) => {
    const { first_name, last_name, email, age, password } = req.body
    try {
        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: "Product create error",
                cause: generateUserErrorInfo ({
                    first_name, last_name, email, age, password}),
                message: "One or more properties were incomplete or not valid",
                code: EErrors.INVALID_USER_ERROR
            })
        }
        next()
    } catch (error) {
        next(error)
    }
},
passport.authenticate('register'), postUser)

userRouter.get('/', getUsers)

//userRouter.delete('/:uid', deleteUser)

userRouter.delete('/', deleteInactiveUsers)



export default userRouter

