import { Router } from "express";
import { deleteUser, getUsers, deleteInactiveUsers, recoverypasswordUser, resetpasswordUser} from "../controllers/user.controller.js";
import { passportError, authorization } from '../utils/messageErrors.js';

const userRouter = Router()

userRouter.post('/recovery-password', recoverypasswordUser)
userRouter.post('/reset-password/:token', resetpasswordUser)
userRouter.get('/', getUsers)
userRouter.delete('/:uid', authorization('Admin'), deleteUser)
userRouter.delete('/', authorization('Admin'), deleteInactiveUsers)

export default userRouter

