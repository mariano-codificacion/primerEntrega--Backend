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

describe("Test de Usuario y carrito",async  () => {
  let token = {};
  let cartId = "";
  let userId = "";
  
//Un error de Fran, es que cerraba el parentesis antes de la async function() Lo corri al final de la funcion, asi como lo hacemos en routes.
  it("Ruta: api/users/register para crear usuario", async function () {
    //Es necesario el timeout porque sino no llega a realizar la funcion a tiempo.
    this.timeout(7000);//Para agregarle timeout no puede ser una funcion tipo flecha, tiene que ser function
    //En un objeto, la key va sin "" . Lo movi dentro de este test ya que solo se utiliza aca.
    const newUser = {
        first_name: "Panchito",
        last_name: "Perez",
        email: "perezito@perez.com",
        password: "coderhouse",
        age: 30,
      };

    const { __body, status } = await requester
      .post("/api/users/register")
      .send(newUser);

    expect(status).to.equal(200);

    console.log(`Status: ${__body}`);
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
    console.log("userId " , userId)
    console.log("cartId ", cartId)
    console.log(`Token: ${token.name} = ${token.value}`);
  });
});
