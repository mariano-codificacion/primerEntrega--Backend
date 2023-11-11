import { Router } from 'express';
import { authorization } from '../utils/messageErrors.js';
import { generateMockProducts } from '../controllers/mockingController.js';

const mockingRouter = Router()
mockingRouter.get('/mockingproducts', generateMockProducts);
export default mockingRouter 