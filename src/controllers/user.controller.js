import logger from "../utils/logger.js"
import userModel from "../models/users.models.js"
import { sendRecoveryEmail, deletionEmail } from "../config/nodemailer.js";
import CustomError from "../service/errors/customError.js";
import EErrors from "../service/errors/enums.js";

const recoveryLinks = {}
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        const filterUser = users.map((user) => {
            const { email, first_name, last_name, rol } = user;
            return { first_name, last_name, email, rol };
        });
        return res.status(200).send(filterUser);
    } catch (error) {
        logger.error(`Error al obtener usuarios: ${error}`);
        return res.status(500).send({ error: `Error al obtener usuarios: ${error}` });
    }
}

export const recoverypasswordUser = async (req, res) => {

    const { email } = req.body
    
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            logger.error(`Usuario no encontrado: ${email}`);
            return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
        }

        const token = crypto.randomBytes(20).toString('hex') //Token unico con el fin de no utilizar JWT para algo simple

        recoveryLinks[token] = { email, timestamp: Date.now() }

        const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`
        console.log(token)
        sendRecoveryEmail(email, recoveryLink)

        res.status(200).send('Correo de recuperacion enviado correctamente')
    } catch (error) {
        res.status(500).send('Error al enviar correo de recuperacion: ', error)
    }
}

export const resetpasswordUser = async (req, res) => {

    const { token } = req.params
    const { newPassword, oldPassword } = req.body
    try {
        //Verifico que el token es valido y no ha expirado (1 hora)
        const linkData = recoveryLinks[token]
        console.log(token)
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            const { email } = linkData

            console.log(email)
            console.log(newPassword)
            console.log(oldPassword)

            const user = await userModel.findOne({ email });
            if (!user) {
                logger.error(`Usuario no encontrado: ${email}`);
                return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
            }
              //Consulto si la nueva contraseña es distinta a la antigua
            const password = validatePassword(newPassword, user.password);
            if (password) {
                logger.error(`La nueva contraseña no puede ser igual a la anterior`);
                return res.status(400).send({ error: `La nueva contraseña no puede ser igual a la anterior` });
            }

            // Update the users password in the database
            user.password = createHash(newPassword);
            await user.save();

            delete recoveryLinks[token]
            logger.info(`Password actualizado correctamente para el usuario ${email}`);
            res.status(200).send('Contraseña modificada correctamente')

        } else {
            res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
        }
    } catch (error) {
        res.status(500).send('Error al cambiar contraseña de cliente: ', error)
    }
}

export const postUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.redirect('/static/login')
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

export const documentsUsers = async (req, res) => {
    const { id } = req.params;

    try {
        const newFiles = req.files['documents'];

        if (newFiles.length === 0) {
            logger.error(`No new documents`);
            return res.status(400).send({ error: 'No new documents' });
        }

        const user = await userModel.findById(id);
        if (!user) {
            logger.error(`Usuario no encontrado: ${id}`);
            return res.status(404).send({ error: `Usuario no encontrado: ${id}` });
        }

        newFiles.forEach((file) => {
            user.documents.push(file.filename);
        });

        await user.save();

        logger.info(`Documentos agregado en el usuario ${id}`);
        return res.status(200).send({ resultado: 'OK', message: 'Documentos agregado correctamente' });
    } catch (error) {
        logger.error(`Error al actualizar documentos: ${error}`);
        return res.status(500).send({ error: `Error al actualizar documentos: ${error}` });
    }
};


export const deleteInactiveUsers = async (req, res) => {
    try {
        
        const timeInactive = new Date(Date.now() - 48 * 60 * 60 * 1000)

        console.log(timeInactive)
        //const parsetimeInactive = Date.parse(timeInactive)
        //console.log(parsetimeInactive)

        const users = await userModel.find({ last_connection: { $lt: new Date(timeInactive) } });

        if (users.length === 0) {
            console.log(users)
            logger.warn(`No se encontraron usuarios inactivos`);
            return res.status(404).send({ error: `No se encontraron usuarios inactivos` });
        } else {
            users.forEach(async user => {
                deletionEmail(user.email);
                await userModel.deleteOne({ _id: user._id });
            });
            res.json({ message: 'Usuarios inactivos eliminados y notificados.' });
        }
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error al eliminar usuarios inactivos ${error}` })
    }
};