import { Router } from 'express';
import { productModel } from '../models/products.models.js';
import { ProductManager } from '../controllers/productManager.js';

const productRouter = Router()

const productManager = new ProductManager('./src/products.json')

productRouter.get('/', async (req, res) => {
    const { limit } = req.query
    try {
        const prods = await productModel.find().limit(limit)
        const products = await productManager.getProducts()
        const productos = products.slice(0, limit)
        res.status(200).send({ resultado: 'OK', message: prods })
    } catch (error) {
        res.status(400).send({ error: `Error al consultar productos:  ${error}` })
    }
})

productRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const prod = await productModel.findById(id)
        const producto = await productManager.getProductById(parseInt(id))
        if (prod) {
            res.status(200).send({ resultado: 'OK', product: prod })
        } else {
            res.status(404).send({ resultado: 'Not Found', message: prod })
        }
    } catch (error) {
        res.status(400).send({ error: `Error al consultar producto:  ${error}` })
    }
})

productRouter.post ('/', async (req, res) => {
    const { title, description, price, stock, category, code } = req.body
    //Verificacion de datos
    try {
        const confirmacion = await productManager.addProduct(req.body)
        const respuesta = await productModel.create({
            title, description, price, stock, category, code
        })
        res.status(200).send({ resultado: 'OK', message: respuesta })
    } catch (error) {
        res.status(400).send({ error: `Error al crear producto:  ${error}` })
    }
})


productRouter.put ('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, price, stock, category, code } = req.body
    try {
        const confirmacion = await productManager.updateProduct(req.params.id, req.body)
        const respuesta = await productModel.findByIdAndUpdate(id, { title, description, price, stock, category, code })
        if (respuesta) {
            res.status(200).send({ resultado: 'OK', message: respuesta, confirmacion })
        } else {
            res.status(404).send({ resultado: 'Not Found', message: respuesta })
        }
    } catch (error) {
        res.status(400).send({ error: `Error al actualizar producto:  ${error}` })
    }
})

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const confirmacion = await productManager.deleteProduct(req.params.id)
        const respuesta = await productModel.findByIdAndDelete(id)
        if (respuesta){
            res.status(200).send({ resultado: 'OK', message: respuesta})
        }else{
            res.status(404).send({ resultado: 'Not Found', message: respuesta})
    }
    } catch (error) {
        res.status(400).send({ error: `Error al eliminar producto: ${error}` })
    }
})

export default productRouter