import { config } from 'dotenv';
import { HttpException } from '@exceptions/HttpException';

const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new HttpException(500, 'You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

if (process.env.NODE_ENV !== 'production') {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const DB_HOST = requireProcessEnv('DB_HOST');
export const DB_PORT = requireProcessEnv('DB_PORT');
export const DB_USER = requireProcessEnv('DB_USER');
export const DB_PASSWORD = requireProcessEnv('DB_PASSWORD');
export const DB_DATABASE = requireProcessEnv('DB_DATABASE');
export const SECRET_KEY = requireProcessEnv('SECRET_KEY');
export const LOG_FORMAT = requireProcessEnv('LOG_FORMAT');
export const LOG_DIR = requireProcessEnv('LOG_DIR');
export const ORIGIN = requireProcessEnv('ORIGIN');
export const MASTER = requireProcessEnv('MASTER');
export const CREDENTIALS = requireProcessEnv('CREDENTIALS') === 'true';

//   },
// };
