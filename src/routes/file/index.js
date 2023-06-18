import express from 'express';
import { validateFileInput } from '../../middlewares/validation.js';
import { validate } from '../../middlewares/validationMiddleware.js';
import {
  uploadFile,
  fetchFile,
  updateFile,
  deleteFile,
} from '../../services/file.js';
import multer from 'multer';
import { storageEngine } from '../../utils/storageEngine.js';

//initializing multer
const upload = multer({
  storage: storageEngine,
});

const router = express.Router();

router.post(
  '/v1/content/files',
  upload.single('file'),
  validate(validateFileInput),
  uploadFile
);
router.get('/v1/content/folders/:folderName/files/:fileName', fetchFile);
router.put(
  '/v1/content/folders/:folderName/files/:fileName',
  upload.single('file'),
  validate(validateFileInput),
  updateFile
);
router.delete('/v1/content/folders/:folderName/files/:fileName', deleteFile);

export default router;
