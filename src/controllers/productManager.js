
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
        this.id = Product.incrementarID()
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
}

//const productManager = new ProductManager('./prueba.json')
//const product1 = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
//productManager.addProduct(product1)
//const product2 = new Product("producto prueba", "Este es un producto prueba", 220, "Sin imagen", "abc124", 20)
//productManager.addProduct(product2)
//const product3 = new Product("producto prueba", "Este es un producto prueba", 220, "Sin imagen", "abc125", 20)
//productManager.addProduct(product3)
//export default ProductManager
//productManager.getProducts();
//productManager.addProduct(product1)
//productManager.addProduct(product2)
//productManager.getProducts();
//productManager.getProductById(1);
//productManager.deleteProduct(3)
//productManager.getProducts();
//productManager.updateProduct(1,{title: "zanahoria", description: "Este es un producto prueba", price: 200, thumbnail: "Sin imagen", code: "abc123", stock: 20})
//productManager.deleteProduct(2)
//console.log(productManager.getProductById(1))
//productManager.getProducts();
//productManager.deleteProduct(2)
//console.log(productManager.getProducts())

