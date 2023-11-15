import winston from "winston";

export const logger = winston.createLogger({

    levels: {
        fatal:0,
        error: 1,
        warning: 2,
        info: 3,
    },
    transports: [
    new winston.transports.Console ({
        level: 'info', 
        format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize({
            fatal: 'red',
            error: 'orange',
            warning: 'yelow',
            info: 'blue'
        })
        )
    }),
    new winston.transports.File({
        filename: './src/logs/errors.log', level: 'error'
    }),
]
})