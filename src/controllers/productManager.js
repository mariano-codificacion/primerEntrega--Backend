
import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path;
    }
        //static significa metodo de clase
        static incrementarID() {
            if (this.idIncrement) { //Atributo de la clase. Si no existe, lo creo. Si existe, lo aumento en 1
                this.idIncrement++ //Si existe, lo aumento en uno
            } else {
                this.idIncrement = 1 //Valor inicial
            }
            return this.idIncrement
        }

    //Retornar todos los productos
    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        //this.products = JSON.parse(this.path, 'utf-8'))
        //console.log(products);
        return prods;
    }

    async addProduct(product) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = prods.find(producto => producto.code === product.code)

        if (existProd) { //Indico que el producto ya existe
            return false
        } else {
            product.id = ProductManager.incrementarID()
            prods.push(product)
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true
        }

    }

    async getProductById(id) {
        //En el productManager, la ruta esta en this.path
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const buscado = prods.find(producto => producto.id === id)
        if (buscado) {
            return(buscado)
        } else {
            return false
        }
    }
    
    async updateProduct (id, { title, description, price, thumbnail, code, stock, }) {

        let prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));

        const indice = prods.findIndex(prod => prod.id === id)
    
        if (indice != -1) {
            //Mediante el indice modifico todos los atributos de mi objeto
            prods[indice].title = title
            prods[indice].description = description
            prods[indice].price = price
            prods[indice].thumbnail = thumbnail
            prods[indice].code = code
            prods[indice].stock = stock
            
            await fs.writeFile(this.path, JSON.stringify(prods))
            return(prods);
        } else {
            return false
        }
    }
    
    async deleteProduct (id) {
        
        let prods =  JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const buscado = prods.find(item => item.id === id);
        if (buscado) {
        const prod = products.filter(prod => prod.id != id)
        await fs.writeFile(this.path, JSON.stringify(prod))
    }else{
        return false
    }
    }
}
export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock  
    }
   async cargar () {
        await productManager.addProduct(product1)
        timer:500
        const product2 = new Product("Yogurt", "Natural", 400, "Sin imagen", "lac101", 20)
        await productManager.addProduct(product2)
        timer:500
        const product3 = new Product("Queso", "Cremoso", 2000, "Sin imagen", "lac102", 20)
        await productManager.addProduct(product3)
        timer:500
        const product4 = new Product("Manteca", "Natural", 400, "Sin imagen", "lac103", 20)
        await productManager.addProduct(product4)
        timer:500
        const product5 = new Product("Margarina", "Untable", 300, "Sin imagen", "lac104", 20)
        await productManager.addProduct(product5)
        timer:500
        const product6 = new Product("Costilla", "Novillito", 2000, "Sin imagen", "Asa100", 20)
        await productManager.addProduct(product6)
        timer:500
        const product7 = new Product("Vacio", "Novillito", 2500, "Sin imagen", "Asa101", 20)
        await productManager.addProduct(product7)
        timer:500
        const product8 = new Product("Tapa de Asado", "Novillito", 2000, "Sin imagen", "Asa102", 20)
        await productManager.addProduct(product8)
        timer:500
        const product9 = new Product("Falda", "Novillito", 1500, "Sin imagen", "Asa103", 20)
        await productManager.addProduct(product9)
        timer:500
        const product10 = new Product("Entrecot", "Novillito", 2000, "Sin imagen", "Asa104", 20)
        await productManager.addProduct(product10)
        }
    }
const productManager = new ProductManager('./src/products.json')
const product1 = new Product("Leche", "Entera", 1000, "Sin imagen", "lac100", 20)
product1.cargar()
