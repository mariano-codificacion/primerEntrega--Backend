import { Router } from 'express';
import { getProducts, getProduct, postProduct, putProduct, deleteProduct, errorpostProduct } from '../controllers/product.controller.js';
import { passportError, authorization } from '../utils/messageErrors.js';
import  { requestLogger }  from '../middlewares/loggers/requestLogger.js';

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)
productRouter.post('/', requestLogger , errorpostProduct,
    passportError('jwt'), authorization('Admin'), postProduct)
//postProduct)
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), putProduct)
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct)
export default productRouter

