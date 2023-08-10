
import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.products = []
        this.path = path;
    }

async getProductById(id) {
    //En el productManager, la ruta esta en this.path
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const buscado = prods.find(producto => producto.id === parseInt(id))
    if (buscado) {
        return(buscado)
    } else {
        return false
    }
}

async addProduct(product) {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    const existProd = prods.find(producto => producto.code === (product.code))

    if (existProd) { //Indico que el producto ya existe
        return false
    } else {
    if (prods.length === 0) {
        product.id = 1;
    } else {
        product.id = prods[prods.length - 1].id + 1;
    }
        prods.push(product)
        await fs.writeFile(this.path, JSON.stringify(prods))
        return true
    }

}
}