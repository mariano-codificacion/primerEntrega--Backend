import { Router } from 'express';
import { getProducts, getProduct, postProduct, putProduct, deleteProduct } from '../controllers/product.controller.js';
import { passportError, authorization } from '../utils/messageErrors.js';
import CustomError from '../service/errors/customError.js';
import { generateProductErrorInfo } from '../service/errors/info.js';
import EErrors from '../service/errors/enums.js';
import  {requestLogger}  from '../middlewares/loggers/requestLogger.js';

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)
productRouter.post('/', requestLogger ,(req, res, next) => {
    const { title, description, code, price, stock, category } = req.body
    try {
        if (!title || !description || !code || !price || !stock || !category) {
            CustomError.createError({
                name: "Product create error",
                cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
                message: "One or more properties were incomplete or not valid",
                code: EErrors.INVALID_PRODUCT_ERROR
            })
        }
    } catch (error) {
        next(error)
    }
},
    passportError('jwt'), authorization('Admin'), postProduct)
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), putProduct)
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct)
export default productRouter