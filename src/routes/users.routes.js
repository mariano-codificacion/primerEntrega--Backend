import { Router } from "express";
import { deleteUser, getUsers, deleteInactiveUsers, recoverypasswordUser, resetpasswordUser} from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.post('/recovery-password', recoverypasswordUser)
userRouter.post('/reset-password/:token', resetpasswordUser)
userRouter.get('/', getUsers)
userRouter.delete('/:uid', deleteUser)
userRouter.delete('/', deleteInactiveUsers)

export default userRouter

