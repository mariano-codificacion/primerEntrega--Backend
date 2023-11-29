import logger from "../utils/logger.js"

export const postUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.redirect ('/static/login') 
        //res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
}