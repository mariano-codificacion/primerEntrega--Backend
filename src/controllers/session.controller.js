import { generateToken } from "../utils/jwt.js"
import logger from "../utils/logger.js"
import userModel from "../models/users.models.js"

export const registeruserSession  = (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: "User create error",
                cause: generateUserErrorInfo ({
                    first_name, last_name, email, age, password}),
                message: "One or more properties were incomplete or not valid",
                code: EErrors.INVALID_USER_ERROR
            })
        }
        return res.redirect('/static/login')
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
}

export const postSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Invalidate user" })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
           
        }
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        await userModel.findByIdAndUpdate(req.user._id, { last_connection: Date.now() })
        res.redirect('/static/home?info=' + req.user.rol)
        //res.status(200).send({ payload: req.user })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
}

export const getJWT = async (req, res) => {
 
    res.status(200).send({ mensaje: req.user })
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }
}

export const getCurrent = async (req, res) => {
    res.send(req.user)
}


export const getGitHub = async (req, res) => {
    res.redirect('/static/home?info=' + req.user.rol)
}

export const getGithubSession = async (req, res) => {
    req.session.user = req.user
    res.redirect('/static/home?info=' + req.user.rol)  
}


export const getLogout = async (req, res) => {
    if (req.session) {
        req.session.destroy()
    } 
    res.clearCookie('jwtCookie')
    //res.redirect('/static/login')
    res.status(200).send({ resultado: 'Login eliminado' })
}
