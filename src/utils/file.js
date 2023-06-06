import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import logger from './logger.js';
import envVariables from './env.js';
import { extname } from 'path';

export const fileUtil = {
  validateFile(file, allowedExts = ['jpeg', 'jpg', 'png']) {
    if (_.isUndefined(file) || _.isNull(file))
      throw {
        name: 'badRequest',
        message: 'File is required!',
      };

    if (
      !_.some(allowedExts, (ext) => _.includes(extname(file.originalName), ext))
    )
      throw {
        name: 'badRequest',
        message: `Attached file should be ${allowedExts.join(' or ')} format`,
      };
  },

  getFileExtension: (fileName) => {
    const tempArray = _.split(fileName, '.');
    return tempArray[_.size(tempArray) - 1];
  },

  checkFileExists: (folderName, fileNameWithExtension) => {
    const dirPath = path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName);
    const filePath = `${dirPath}/${fileNameWithExtension}`;

    return new Promise((resolve, reject) => {
      resolve(fs.existsSync(filePath));
    });
  },

  saveFile: (folderName, fileName, fileExtension, file) => {
    const dirPath = path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName);

    return new Promise((resolve, reject) => {
      fs.mkdirSync(dirPath, {
        recursive: true,
      });

      const filePath = `${dirPath}/${fileName}.${fileExtension}`;

      const fileStream = fs.createWriteStream(filePath);

      file.on('start', (e) => {
        if (e) {
          logger.error('file.js: file.on -> start', e);
          reject(e);
        }
      });

      file.pipe(fileStream);

      file.on('end', (e) => {
        if (e) {
          logger.error('file.js: file.on -> end', e);
          reject(e);
        }

        resolve(true);
      });
    });
  },

  getFile: (folderName, fileName) =>
    path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName, fileName),

  deleteFile: (folderName, fileNameWithExtension) => {
    const dirPath = path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName);

    return new Promise((resolve, reject) => {
      const filePath = `${dirPath}/${fileNameWithExtension}`;

      fs.unlink(filePath, (e) => {
        if (e) {
          logger.error('file.js', e);
          reject(e);
        }

        resolve(true);
      });
    });
  },
};
