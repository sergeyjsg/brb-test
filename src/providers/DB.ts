
import { Sequelize, Transaction } from 'sequelize';
import logger from './Logger';
import TYPES = Transaction.TYPES;


const sequelize = new Sequelize('sqlite::memory:', {
    dialect: 'sqlite',
    logging: sql => logger.debug(sql),
    transactionType: TYPES.IMMEDIATE
});


export default sequelize;
