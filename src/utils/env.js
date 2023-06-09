import dotenv from 'dotenv';

dotenv.config();

const envVariables = {
  ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  // JWT secret key
  SECRET_KEY: process.env.SECRET_KEY,
  // Attachments folder path
  ATTACHMENT_FOLDER_PATH: process.env.ATTACHMENT_FOLDER_PATH,
  // Access URL
  PUBLIC_URL: process.env.PUBLIC_URL,
  LOCAL_URL: process.env.LOCAL_URL,
  // LOG ROOT DIR NAME
  LOG_DIR_PATH: process.env.LOG_DIR_PATH,
};

export default envVariables;
