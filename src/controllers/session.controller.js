import { generateToken } from "../utils/jwt.js"

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
        res.redirect('/static/home?info=' + req.user.rol)
        //res.status(200).send({ payload: req.user })
    } catch (error) {
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
    res.status(200).send({ resultado: 'Login eliminado' })
}
