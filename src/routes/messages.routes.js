import { Router } from 'express';
import { getMessage, postMessage } from '../controllers/message.controller.js';

const messageRouter = Router();

messageRouter.get('/', getMessage )
messageRouter.post('/', postMessage)

export default messageRouter;
