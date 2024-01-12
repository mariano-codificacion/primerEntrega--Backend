import "dotenv/config"; //Importar dotenv para las variables de entorno
import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import userModel from "../models/users.models.js";

await mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is connected"));

const requester = supertest("http://localhost:4000"); //Apuntar a la ruta del servidor

const expect = chai.expect;

describe("Test de Usuario y carrito", async () => {
  let token = {};
  let cartId = "";
  let userId = "";

  const newUser = {
    first_name: "Panchito",
    last_name: "Perez",
    email: "perezito@perez.com",
    password: "coderhouse",
    age: 30
  };
  
//Un error de Fran, es que cerraba el parentesis antes de la async function() Lo corri al final de la funcion, asi como lo hacemos en routes.
  it("Ruta: api/users/register para crear usuario", async function () {
    //Es necesario el timeout porque sino no llega a realizar la funcion a tiempo.
    this.timeout(7000);//Para agregarle timeout no puede ser una funcion tipo flecha, tiene que ser function
    //En un objeto, la key va sin "" . Lo movi dentro de este test ya que solo se utiliza aca.
    
    /*
    const newUser = {
        first_name: "Panchito",
        last_name: "Perez",
        email: "perezito@perez.com",
        password: "coderhouse",
        age: 30,
      };
    */

    const { __body, status } = await requester
      .post("/api/users/register")
      .send(newUser);

    expect(status).to.equal(302);

    //console.log(`Status: ${__body}`);
  });

  it("Ruta: api/sessions/login con el metodo POST", async function () {
    this.timeout(7000);//Para agregarle timeout no puede ser una funcion tipo flecha, tiene que ser function
    const newUser = {
      email: "perezito@perez.com",
      password: "coderhouse",
    };
    const response = await requester.post("/api/sessions/login").send(newUser);
    const { __body } = response;
    const tokenResult = response.header["set-cookie"][0]; //Primero tenemos que setear la cookie con set-cookie.

    expect(tokenResult).to.be.ok; //Comprobar la existencia o no del elemento

    expect(response.status).to.be.equal(302); //Aca te da una respuesta 302, que significa redirect. Esto es porque en tu codigo al logearse te ridirige a otra pagina.
    //O cambias el expect para qeu espere un 302, o cambias la respuesta del controller de user.

    token = {
      name: tokenResult.split("=")[0],
      value: tokenResult.split("=")[1],
    };

    expect(token.value).to.be.ok;
    expect(token.name).to.be.ok.and.equal("jwtCookie");

    const user = await userModel.findOne({ email: newUser.email });
    console.log(user);
    cartId = user.cart;
    userId = user._id
    //console.log("userId " , userId)
    //console.log("cartId ", cartId)
    //console.log(`Token: ${token.name} = ${token.value}`);
  });

  
    it('Ruta: api/carts/cid/product/pid con metodo POST', async function () {
        const cid = cartId
        const pid = "64f8d27fe8649c4df8725caa"

        this.timeout(7000)
        // await requester.post(`/api/carts/products/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]) AGREGAR DOS VECES EL MISMO PRODUCTO

        const { __body, status } = await requester.post(`/api/carts/${cid}/product/${pid}`)
        .set('Cookie', [`${token.name} = ${token.value}`])
        .send({
          quantity: 1
        });
        expect(status).to.equal(200)

        //console.log("Agregado producto en api carts")
        

    })
  
  
    it('Ruta: api/carts/cid/product/pid Metodo PUT', async function () {
        const cid = cartId
        const pid = "64f8d27fe8649c4df8725caa"
        const newQuantity = { quantity: 6 }

        this.timeout(7000)

        const { __body, status } = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQuantity).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        //console.log("Cantidad producto actualizada en api carts")
        //console.log(`Status: ${__body}`)
    })
  

  
    it('Ruta: api/users/:uid metodo DELETE', async function () 
    {
        const uid = userId

        this.timeout(7000)

        const { __body, status } = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`])

        expect(status).to.equal(200)

        //console.log("Usuario eliminado en api/users")
        //console.log(`Status: ${__body}`)

    })

});
