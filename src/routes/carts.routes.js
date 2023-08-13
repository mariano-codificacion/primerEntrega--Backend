import { Router } from 'express';
import { CartManager } from '../controllers/cartManager.js';

const routerCarts = Router();
const cartManager = new CartManager('./src/carts.json');

routerCarts.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const products = await cartManager.getProductByCart(parseInt(cid));
	products ? res.status(200).send(products) : res.status(404).send('Carrito no existente');
});

routerCarts.post('/', async (req, res) => {
	await cartManager.agregarCarrito();
	res.status(200).send('Carrito creado correctamente');
});

routerCarts.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const confirmacion = await cartManager.addProdCart(parseInt(cid), parseInt(pid));
	confirmacion
		? res.status(200).send('Producto agregado correctamente')
		: res.status(404).send('Carrito o producto inexistente');
});

export default routerCarts;