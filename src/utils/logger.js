import winston from "winston";

//export const logger = winston.createLogger({
const customLevels = {
    levels: {
        fatal:0,
        error: 1,
        warning: 2,
        info: 3
    },
    colors: {
    fatal: 'red',
    error: 'mayenta',
    warning: 'yelow',
    info: 'blue'
},
}
winston.addColors(customLevels.colors)
const logger = winston.createLogger({

    levels: customLevels.levels,

    transports: [
    new winston.transports.Console ({
        level: 'info', 
        format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
        )
    }),
    new winston.transports.File({
        filename: './src/logs/errors.log', 
        level: 'error',
    })
],
})

export default logger