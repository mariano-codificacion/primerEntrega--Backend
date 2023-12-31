
import messageModel from '../models/message.models.js';
import logger from '../utils/logger.js';

export const getMessage = async (req, res) => {
	try {
		const messages = await messageModel.find();
		res.status(200).send({ resultado: OK, message: messages });
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: `Error al consultar mensajes: ${error}` });
	}
};

export const postMessage = async (req, res) => {
	const { email, message } = req.body;
	try {
		const respuesta = await messageModel.create({
			email,
			message,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
		res.status(400).send({ error: `Error al crear mensaje: ${error}` });
	}
};