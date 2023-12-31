import { faker } from '@faker-js/faker';

const mockProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 200 }),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        status: true,
        code: faker.string.alphanumeric(10),
        thumbnails: [faker.image.avatar()]
    }
}
export const generateMockProducts = (req, res) => {
    //const { cProd } = req.params
    const products = []
    for (let i = 0; i < 100; i++) {
        products.push(mockProducts())
    }
    res.send(products)

}
