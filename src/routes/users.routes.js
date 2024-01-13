import { Router } from "express";
import { deleteUser, getUsers, deleteInactiveUsers, recoverypasswordUser, resetpasswordUser, documentsUsers} from "../controllers/user.controller.js";
import { authorization } from '../utils/messageErrors.js';
import multer from 'multer'

const upload = multer({ dest: 'documents/' });
const userRouter = Router()

userRouter.post('/recovery-password', recoverypasswordUser)
userRouter.post('/reset-password/:token', resetpasswordUser)
userRouter.post('/:uid/documents', upload.array('documents'), documentsUsers)
userRouter.get('/', getUsers)
userRouter.delete('/:uid', authorization('Admin'), deleteUser)
userRouter.delete('/', authorization('Admin'), deleteInactiveUsers)

export default userRouter

