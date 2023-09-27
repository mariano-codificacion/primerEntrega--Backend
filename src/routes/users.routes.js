import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";

const userRouter = Router()

userRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password} = req.body
    try {
        //const hashPassword = createHash(password)
        let response = await userModel.create({ first_name, last_name, email, age, password})
        if (response.email == "adminCoder@coder.com" && response.password == "adminCod3r123"){
        response.rol = "admin"
        await response.save();
        res.redirect ('/static/login') 
        }
        res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
    } catch (error) {
        res.status(400).send({ error: `Error en create user: ${error}` })
    }

})

export default userRouter