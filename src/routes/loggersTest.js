import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import logger from "../utils/logger.js";

const loggerRouter = Router();

loggerRouter.get("/", passportError('jwt'), authorization(['admin']), (req, res) => {
    logger.fatal("Esto es un logger de fatal");
    logger.error("Esto es un logger de error");
    logger.warn("Esto es un logger de warn");
    logger.info("Esto es un logger de info");
    res.send("OK: Loggers successfully loaded");
});

export default loggerRouter;