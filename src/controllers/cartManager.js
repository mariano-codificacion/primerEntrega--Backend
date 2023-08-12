
import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.carritos = []
        this.path = path
    }

    async agregarCarrito() {
        this.carritos = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const nuevoCarrito = {}
        if (this.carritos.length === 0) {
            nuevoCarrito.id = 1;
        } else {
            nuevoCarrito.id = this.carritos[this.carritos.length - 1].id + 1;
        }
        nuevoCarrito.products = []
        this.carritos.push(nuevoCarrito)
        await fs.writeFile(this.path, JSON.stringify(this.carritos))
    }

    async getProductByCart(cid) {

        this.carritos = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const buscado = this.carritos.find(carrito => carrito.id === parseInt(cid))
        if (buscado) {
            return buscado
        } else {
            return false
        }
    }

    async addProdCart(cid, pid) {
        const prods = JSON.parse(await fs.readFile('src/products.json', 'utf-8'))
        const agregarProd = prods.find(producto => producto.id === parseInt(pid))
        this.carritos = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existeCarrito = this.carritos.find(carrito => carrito.id === parseInt(cid))

        if (!agregarProd) {
            return false
        } else {
            if (!existeCarrito) {
                return false
            } else {
                const existeProducto = existeCarrito.products.find(products => products.id === parseInt(pid))
                if (existeProducto) { //Indico que el producto ya existe
                    existeProducto.cantidad++
                } else {
                    const nuevoProducto = {}
                    nuevoProducto.cantidad = 1
                    nuevoProducto.id = agregarProd.id
                    existeCarrito.products.push(nuevoProducto)
                }
                await fs.writeFile(this.path, JSON.stringify(this.carritos))
                return true
            }

        }

    }
}

