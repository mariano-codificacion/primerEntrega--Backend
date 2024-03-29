import productModel from "../models/products.models.js";
import logger from "../utils/logger.js";
import CustomError from '../service/errors/customError.js';
import { generateProductErrorInfo } from '../service/errors/info.js';
import EErrors from '../service/errors/enums.js';


export const getProducts = async (req, res) => {
    const { limit, page, sort, category, status } = req.query;

    const parsedLimit = parseInt(limit) || 10
    const parsedPage = parseInt(page) || 1
    const getSorted = sort === 'asc' || sort === 'desc' ? sort : null

    const query = {}
    if (category) query.category = category
    if (status) query.status = status

    try {
        const prod = await productModel.paginate(query, { limit: parsedLimit, page: parsedPage, sort: { price: getSorted } });
  
        if (prod) {
            return res.status(200).send(prod)
        }

        res.status(404).send({ error: "Productos no encontrados" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}

export const postProduct = async (req, res) => {

    const { title, description, code, price, stock, category } = req.body

    try {
        const product = await productModel.create({ title, description, code, price, stock, category })

        if (product) {
            return res.status(201).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        if (error.code == 11000) {
            return res.status(400).send({ error: `Llave duplicada` })
        } else {
            return res.status(500).send({ error: `Error en consultar producto ${error}` })
        }

    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body
    try {
        const product = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productModel.findByIdAndDelete(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}

export const errorpostProduct = async (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body
    try {
        if (!title || !description || !code || !price || !stock || !category) {
            CustomError.createError({
                name: "Product create error",
                cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
                message: "One or more properties were incomplete or not valid",
                code: EErrors.INVALID_PRODUCT_ERROR
            })
        }
        next()
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleString()} - ${error.message}`)
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
        next(error)
    }
}