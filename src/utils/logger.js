import winston from "winston";

const customOptionsLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'blue',
    }
};

const logger = winston.createLogger({
    levels: customOptionsLevels.levels,
  
    transports: [
        new winston.transports.Console({
         
            level: 'info',

            format: winston.format.combine(
                winston.format.colorize({colors: customOptionsLevels.colors} ),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename: './logs/errors.log',  level: 'warn' })
    ]
})

export default logger