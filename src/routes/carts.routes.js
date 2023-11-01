import { Router } from 'express';
import { getCart, getCarts, postCart, postProdCart,putProdCart, putArrayInCart, deleteProdCart, deleteCart, ticketCart } from '../controllers/cart.controller.js';
import { passportError, authorization } from '../utils/messageErrors.js';

const cartsRouter = Router();

cartsRouter.get('/', getCarts)
cartsRouter.get('/:cid', getCart)
cartsRouter.post('/', postCart)
cartsRouter.post('/:cid/products/:pid', passportError('jwt'), postProdCart)
cartsRouter.put('/:cid/products/:pid', passportError('jwt'), putProdCart)
cartsRouter.put('/:cid', passportError('jwt'), authorization('Admin'), putArrayInCart)
cartsRouter.delete('/:cid/products/:pid',  passportError('jwt'), deleteProdCart)
cartsRouter.delete('/:cid', passportError('jwt'), deleteCart)
cartsRouter.get('/:cid/purchase', ticketCart)
export default cartsRouter