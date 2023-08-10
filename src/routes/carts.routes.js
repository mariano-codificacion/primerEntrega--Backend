import { Router } from 'express'
import {CartManager} from '../controllers/cartManager.js'

const cartProd = Router()

const cartManager = new CartManager('./src/carts.json')


cartProd.get('/:cid', async (req, res) => {
    const { id } = req.params
    const prod = await cartManager.getProductById(parseInt(id))

    if (prod){
        res.status(200).send(prod)
}else{
        res.status(404).send("Producto no existente")
    }
})

cartProd.post('/:cid/product/:pid', async (req, res) => {
    const confirmacion = await cartManager.addProduct(req.body)

    if (confirmacion){
        res.status(200).send("Producto creado correctamente")
    }else{
        res.status(400).send("Producto ya existente")
    }
})




export default cartProd