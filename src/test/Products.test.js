import mongoose from "mongoose";
import productModel from "../models/products.models";
import Assert from "assert";
import { beforeEach } from "mocha";

await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is connected"))

const assert = Assert.strict

describe('testing Products', () => {
    before(function () {
        this.products = new Products
    })

    beforeEach(function() {
        this.timeout(7000)
    })

    it('Consultar todos los productos de mi BDD', async function () { //Descripcion de la operacion
        const resultado = await productModel.find()
        assert.strictEqual(Object.isObject(resultado), true)
        //Ambito de ejecucion propio
    })

    it("Crear un nuevo usuario", async function () {
        const newProduct = {
            title: 'Nalga',
            description: 'Novillito',
            price: '5000',
            stock: '100',
            category: 'carnes' ,
            status: 'true',
            code: 'Asa150' ,
            thumbnails: []  
        }
        const resultado = await productModel.create(newProduct)
        assert.ok(resultado._id) //Reviso si se guardo correctamente el producto
    })

    it("Consultar a un producto dado su _id", async function () {
        const id = '6542c281ce4b0d4a8a8b84c7'

        const product = await productModel.findById({ id: id })
        assert.strictEqual(typeof product, 'object')
    })
}) 