import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";
import userModel from "../models/users.models.js";
import logger from "../utils/logger.js";

export const getCarts = async (req, res) => {
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: carts });
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
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
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: `Error al consultar carrito: ${error}` });
	}
}

export const postProdCart = async (req, res) => {
// agregar producto al carrito
const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		const product = await productModel.findById(pid);

		if (!product) {
			res.status(404).send({ resultado: 'Product Not Found', message: product });
			return false;
		}

		if (product.stock === 0) {
			console.log(product.stock);
			res.status(400).send({ error: `No hay stock` });
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);

			if (!productExists) {
				cart.products.push({ id_prod: product._id, quantity: 1 });
			} else if (productExists.quantity < product.stock) {
				productExists.quantity++;
			} else {
				return res.status(400).send({ error: `No hay stock suficiente` });
			}

			await cart.save();
			return res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(500).send({ error: `Error al crear producto: ${error}` });
	}
};
	
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
				res.status(404).send({ resultado: 'Product Not Found'});
				return
			}
		} else {
			res.status(404).send({ resultado: 'Cart Not Found'});
		}
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: error })
	}
}

export const putquantityprodCart = async (req, res) => {
	// agregar cantidad de un producto
	const { cid, pid } = req.params;
	const { quantity } = req.body;
	const product = await productModel.findById(pid);

	try {
		const cart = await cartModel.findById(cid);

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (productExists) {
				if (product.stock < productExists.quantity + quantity) {
					res.status(400).send({ error: `No hay stock suficiente` });
				}
				productExists.quantity += quantity;
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};

export const putArrayInCart = async (req, res) => {
	const { cid } = req.params;
	const putprod = req.body;

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
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
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
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
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
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
	}
}

export const ticketCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		const products = await productModel.find();
		if (cart) {
			const user = await userModel.find({ cart: cart._id });
			const email = user[0].email;
			let amount = 0;
			cart.products.forEach(async cartProd => {
				const prod = products.find(arrayProd => arrayProd._id == cartProd.id_prod.toString());
				if (prod) {
					if (prod.stock >= cartProd.quantity) {
						prod.stock -= cartProd.quantity
						amount += prod.price * cartProd.quantity;
						
						await prod.save();
						//res.status(200).send({ resultado: 'OK', message: cart })
					} else {
						res.status(404).send({ stock: 'Insuficiente', message: cart });
					}
				} else {
					res.status(404).send({ resultado: 'Not Found', message: cart });
				}
			})
			if (user[0].rol === 'premium') {
				amount = amount * 0.9;
			}
			await cartModel.findByIdAndUpdate(cid, { products: [] });
			res.redirect(
				`/api/tickets/create?amount=${amount}&email=${email}`
				//`http://localhost:4000/api/tickets/create?amount=${amount}&email=${email}`
			);
		}else{
		res.status(400).send({ error: `Error al buscar el carrito: ${error}` });
		}
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: `Error al finalizar la compra: ${error}` });
	}
}
