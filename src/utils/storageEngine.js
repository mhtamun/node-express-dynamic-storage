import multer from 'multer';
import envVariables from './env.js';

//Setting storage engine
export const storageEngine = multer.diskStorage({
  destination: envVariables.ATTACHMENT_FOLDER_PATH,
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
