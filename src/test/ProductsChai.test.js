import chai from "chai";
import mongoose from "mongoose";
import productModel from "../models/products.models";

await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is connected"))

const expect = chai.expect

describe("Test con chai para users", () => {
    before(function () {
        this.products = new Products
    })
    beforeEach(function () {
        mongoose.connection.collections.products.drop() //Elimino de la BDD
        this.timeout(6000)
    })

    it('Consultar todos los usuarios de mi BDD con Chai', async function () { //Descripcion de la operacion
        const resultado = await productModel.find()
        //expect(resultado).deep.equal([])
        expect(Object.isObject(resultado)).to.be.ok //ok revisa si en expect es V o F
        //expect(resultado).to.be.deep.equal([])

    })
})