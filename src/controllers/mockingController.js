import { faker } from '@faker-js/faker';
import productModel from '../models/products.models.js';

export const generateMockProducts = async (req, res) => {
    try {
        for (let i = 0; i < 100; i++) {
            const productData = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price({ min: 100, max: 200 }),
                stock: faker.number.int({ min: 10, max: 100 }),
                category: faker.commerce.department(),
                status: true,
                code: faker.string.alphaNumeric(10),
                thumbnails: [faker.image.avatar()]
            };
            
            const newProduct = await productModel.create(productData);
        }
        res.json({ message: 'Productos de prueba creados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};