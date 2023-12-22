import logger from "../utils/logger.js"
import userModel from "../models/users.models.js"

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


export const deleteUser = async (req, res) => {
    const { uid } = req.params

    try {
        const user = await userModel.findByIdAndDelete(uid)

        if (user) {
            return res.status(200).send(user)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en eliminar usuario ${error}` })
    }
}