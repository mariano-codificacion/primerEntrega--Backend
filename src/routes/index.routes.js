import { Router } from "express";
import cartsRouter from "./carts.routes.js";
import productRouter from "./products.routes.js";
import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import routerTicket from "./tickets.routes.js";
import mockingRouter from "./mocking.routes.js";

const router = Router()

router.use('/api/product', productRouter)
router.use('/api/users', userRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/sessions', sessionRouter)
router.use('/api/tickets', routerTicket)
router.use('/api/mocking', mockingRouter)
export default router
