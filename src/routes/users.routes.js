import { Router } from "express";
import passport from "passport";
import { postUser, deleteUser, getUsers, deleteInactiveUsers, recoverypasswordUser, resetpasswordUser} from "../controllers/user.controller.js";
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

userRouter.post('/recovery-password', recoverypasswordUser)

userRouter.post('/reset-password/:token', resetpasswordUser)

userRouter.get('/', getUsers)

userRouter.delete('/:uid', deleteUser)

userRouter.delete('/', deleteInactiveUsers)

export default userRouter

