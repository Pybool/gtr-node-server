import { config as dotenvConfig } from "dotenv";
dotenvConfig();
dotenvConfig({path:`.env.${process.env.NODE_ENV}`});

export default {
  generic: {
    host: process.env.GHANATALKSRADIO_REDIS_HOST,
    port: parseInt(process.env.GHANATALKSRADIO_REDIS_GENERIC_PORT as string),
    password: process.env.REDIS_PASSWORD
  }
};
  
