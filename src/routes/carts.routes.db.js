import { Router } from 'express';
import cartModel from '../models/carts.models.js';
import { CartManager } from '../controllers/cartManager.js';

const cartsRouter = Router();

cartsRouter.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: OK, message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carritos: ${error}` });
	}
});

cartsRouter.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
});

cartsRouter.post('/', async (req, res) => {
	const { id_prod, quantity } = req.body;

	try {
		const respuesta = await cartModel.create({
			id_prod,
			quantity,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

cartsRouter.update('/:cid', async (req, res) => {
	const { cid } = req.params;
	const { id_prod, quantity } = req.body;

	try {
		const prod = await cartModel.findByIdAndUpdate(cid, {
			id_prod,
			quantity,
		});
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

cartsRouter.delete('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndDelete(cid);
		cart
			? res.status(200).send({ resultado: OK, message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
	}
});

export default cartsRouter;
