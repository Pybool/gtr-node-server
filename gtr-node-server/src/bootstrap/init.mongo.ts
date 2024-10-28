import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';
import logger from './logger';
dotenvConfig()
dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });

const mongouri:any = process.env.GHANATALKSRADIO_MONGODB_URI
logger.info("MONGO_URI: "+mongouri)
logger.info("DATABASE NAME "+process.env.GHANATALKSRADIO_DATABASE_NAME)
mongoose 
  .connect(mongouri, {
    dbName: process.env.GHANATALKSRADIO_DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(async() => {
    logger.info('MongoDB connected Successfully.')
  })
  .catch((err:any) => logger.info(err.message))

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
  logger.info(err.message)
})

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection is disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
