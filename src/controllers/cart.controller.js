import cartModel from "../models/carts.models.js";

export const getCarts = async (req, res) => {
    const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carritos: ${error}` });
	}
}

export const getCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
}

export const postCart = async (req, res) => {
    const { id_prod, quantity } = req.body
	try {
		const crearCarrito = await cartModel.create({
			id_prod, quantity
		})
		res.status(200).send({ resultado: 'OK', message: crearCarrito })
	} catch (error) {
		res.status(400).send({ error: `Error al crear carrito:  ${error}` })
	}
}

export const postProdCart = async (req, res) => {
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
}

export const putProdCart = async (req, res) => {
	const { cid, pid } = req.params
	const { quantity } = req.body
	try {
		const cart = await cartModel.findById(cid)
		if (cart) {
			const prod = cart.products.find(prod => prod.id_prod == (pid))
			if (prod) {
				prod.quantity = quantity
				await cart.save();
				res.status(200).send({ respuesta: 'OK', mensaje: `Cantidad Actualizada` })
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: error });
				return
			}
		}else{
		res.status(404).send({ resultado: 'Cart Not Found', message: error });
		}
	} catch (error) {
		res.status(400).send({ error: error })
	}
}

export const putArrayInCart = async (req, res) => {
    const { cid } = req.params;
	const putprod  = req.body;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			putprod.forEach(product => {
				const prod = cart.products.find(cartProd => cartProd.id_prod == product.id_prod);
				if (prod) {
					prod.quantity = product.quantity;
				} else {
					cart.products.push(product);
				}
			});
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart })
		} else { 
		res.status(404).send({ resultado: 'Cart Not Found', message: error });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
}

export const deleteProdCart = async (req, res) => {
    const { cid, pid } = req.params
	try {
		const cart = await cartModel.findById(cid)
		if (cart) {
			const indice = cart.products.findIndex(prod => prod.id_prod == (pid))
			if (indice != -1) {
				cart.products.splice(indice, 1)
				cart.save()
				res.status(200).send({ respuesta: 'OK', mensaje: `El Producto id: ${pid} del carrito id: ${cid} fue eliminado correctamente` })
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
			}
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: error });
		}
	} catch (error) {
		res.status(400).send({ error: error })
	}
}

export const deleteCart = async (req, res) => {
    const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		if (cart) {
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
	}
}
 