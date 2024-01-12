import { Router } from 'express';
import { getCart, getCarts, postProdCart, putProdCart, putArrayInCart, putquantityprodCart , deleteProdCart, deleteCart, ticketCart} from '../controllers/cart.controller.js';
import { passportError, authorization } from '../utils/messageErrors.js';

const cartsRouter = Router();

cartsRouter.get('/', getCarts)
cartsRouter.get('/:cid', getCart)
cartsRouter.post('/:cid/product/:pid', passportError('jwt'), authorization(["user","premium"]), postProdCart)
cartsRouter.put('/:cid/product/:pid', passportError('jwt'), authorization(["user","premium"]), putProdCart)
cartsRouter.put('/:cid/product/:pid', passportError('jwt'), authorization(["user","premium"]), putquantityprodCart)
cartsRouter.put('/:cid', passportError('jwt'), authorization('Admin'), putArrayInCart)
cartsRouter.delete('/:cid/product/:pid',  passportError('jwt'), authorization(["user","premium"]), deleteProdCart)
cartsRouter.delete('/:cid', passportError('jwt'), authorization(["user","premium"]), deleteCart)
cartsRouter.post('/:cid/purchase',  ticketCart )

export default cartsRouter

