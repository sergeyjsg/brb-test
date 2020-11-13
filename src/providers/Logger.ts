
import * as winston from 'winston';
import { Logger as LoggerInstance } from 'winston';
import { LoggerConfig } from '../definitions';
import config from './Config';


export class Logger {

    public static init (config: LoggerConfig): LoggerInstance {
        let transports: any = [
            new winston.transports.Console()
        ];

        const logger: LoggerInstance = winston.createLogger({
            transports,
            level: config.level || 'info',
            format: winston.format.combine(
                winston.format.simple()
            )
        });

        logger.on('error', (err: Error) => console.error(err));

        return logger;
    }
}

export default Logger.init(config.logger);
