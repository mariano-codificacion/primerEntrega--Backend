import "dotenv/config";
import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import userModel from "../models/users.models.js";

await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is connected"))

const requester = supertest('http://localhost:4000') //Apuntar a la ruta del servidor

const expect = chai.expect

describe('Test de Usuario y carrito', async () => {

    let token = {}
    let cartId = ""
    let userId = ""
    const newUser = {
        "first_name": "Panchito",
        "last_name": "Perez",
        "email": "perezito@perez.com",
        "password": "coderhouse",
        "age": 30,
    }


    it("Ruta: api/users/register para crear usuario"), async function () {

        this.timeout(7000)

        const { __body, status } = await requester.post('api/users/register').send(newUser)

        expect(status).to.equal(200)

        console.log(`Status: ${__body}`)
    }

    it("Ruta: api/sessions/login con el metodo POST"), async function () {

        this.timeout(7000)

        const response = await requester.post('api/sessions/login').send(newUser)
        
        const { __body } = response
        const tokenResult = response.header['set-cookie'][0]

        expect(tokenResult).to.be.ok //Comprobar la existencia o no del elemento

        expect(response.status).to.be.equal(302) //Consulto si la respuesta de la peticion es igual a 302 (redireccion)

        token = {
            name: tokenResult.split("=")[0],
            value: tokenResult.split("=")[1]
        }

        expect(token.value).to.be.ok
        expect(token.name).to.be.ok.and.equal('jwtCookie')
      

        const user = await userModel.findOne({ email: newUser.email });
        console.log(user);
        userId = __body._id
        cartId = __body.cartId
        console.log(`Token: ${token.name} = ${token.value}`)
    }

    it('Ruta: api/carts/:cid/product/:pid con metodo POST', async function () {
        const cid = cartId
        const pid = ""

        this.timeout(7000)
        /* await requester.post(`/api/carts/products/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]) AGREGAR DOS VECES EL MISMO PRODUCTO*/

        const { __body, status } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        console.log("Agregado producto en api carts")
        console.log(`Producto: ${__body.products}`)

    })

    it('Ruta: api/carts/:cid/product/:pid Metodo PUT', async function () {
        const cid = cartId
        const pid = ""
        const newQuantity = { quantity: 6 }

        this.timeout(7000)

        const { __body, status } = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQuantity).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        console.log("Cantidad producto actualizada en api carts")
        console.log(`Status: ${__body}`)
    })



    it('Ruta: api/users/uid metodo DELETE'), async function () 
    {
        const uid = userId

        this.timeout(7000)

        const { __body, status } = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        console.log("Usuario eliminado en api/users")
        console.log(`Status: ${__body}`)

    }
})