import { Router } from 'express'
import {ProductManager} from '../controllers/productManager.js'

const cartProd = Router()

const productManager = new ProductManager('./src/products.json')



cartProd.get('/:cid', async (req, res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod){
        res.status(200).send(prod)
}else{
        res.status(404).send("Producto no existente")
    }
})

cartProd.post('/:cid/product/:pid', async (req, res) => {
    
})



export default cartProd