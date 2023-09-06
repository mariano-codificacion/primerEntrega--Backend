import { Router } from 'express';
import cartModel from '../models/carts.models.js';


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
		if (cart) {
		res.status(200).send({ resultado: OK, message: cart })
		}else{
		res.status(404).send({ resultado: 'Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
});

cartsRouter.post ('/', async (req, res) => {
	const { id_prod, quantity } = req.body
    try {
        const crearCarrito = await cartModel.create({
           id_prod, quantity
        })
        res.status(200).send({ resultado: 'OK', message: crearCarrito })
    } catch (error) {
        res.status(400).send({ error: `Error al crear carrito:  ${error}` })
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            cart.products.push({ id_prod: pid, quantity: quantity })
            const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizo el carrito de mi BDD con el nuevo producto
            res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
        }
    } catch (error) {
        res.status(400).send({ error: error })
    }
})

export default cartsRouter