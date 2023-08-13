import { Router } from 'express'
import {ProductManager} from '../controllers/productManager.js'

const routerProds = Router()

const productManager = new ProductManager('./src/products.json')

routerProds.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)

})

routerProds.get('/p:id', async (req, res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod){
        res.status(200).send(prod)
}else{
        res.status(404).send("Producto no existente")
    }
})

routerProds.post('/p:id', async (req, res) => {
    const confirmacion = await productManager.addProduct(req.body)

    if (confirmacion){
        res.status(200).send("Producto creado correctamente")
    }else{
        res.status(400).send("Producto ya existente")
    }
})

routerProds.put('/p:id', async (req, res) => {

    const confirmacion = await productManager.updateProduct(req.params.id, req.body)

    if (confirmacion){
        res.status(200).send("Producto actualizado correctamente")
    }else{
        res.status(404).send("Producto no encontrado")
    }
})

routerProds.delete('/p:id', async (req, res) => {

    const confirmacion = await productManager.deleteProduct(req.params.id)

    if (confirmacion){
        res.status(200).send("Producto eliminado correctamente")
    }else{
        res.status(404).send("Producto no encontrado")
    }
})

export default routerProds