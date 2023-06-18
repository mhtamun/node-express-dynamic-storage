import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import logger from './logger.js';
import envVariables from './env.js';
import { extname } from 'path';
import { convertToWebp } from './webpConverter.js';

export const fileUtil = {
  validateFile: (file, allowedExts = ['jpeg', 'jpg', 'png']) => {
    if (_.isUndefined(file) || _.isNull(file))
      throw {
        name: 'badRequest',
        message: 'File is required!',
      };

    if (
      !_.some(allowedExts, (ext) => _.includes(extname(file.originalname), ext))
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

  checkFileExists: (folderName, fileName, fileExtension) => {
    const dirPath = path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName);
    let filePath;
    if (
      fileExtension.toLowerCase() === 'jpg' ||
      fileExtension.toLowerCase() === 'png' ||
      fileExtension.toLowerCase() === 'jpeg'
    ) {
      filePath = `${dirPath}/${fileName}.webp`;
    } else {
      filePath = `${dirPath}/${fileName}.${fileExtension}`;
    }

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

      if (
        fileExtension.toLowerCase() === 'jpg' ||
        fileExtension.toLowerCase() === 'png' ||
        fileExtension.toLowerCase() === 'jpeg'
      ) {
        //convert image to webp
        convertToWebp(dirPath, fileName, file);
      } else {
        //gets file name and move it to desired directory
        let renamedFile = path.basename(
          `${envVariables.ATTACHMENT_FOLDER_PATH}/${fileName}.${fileExtension}`
        );
        let dest = path.resolve(`${dirPath}/`, renamedFile);

        fs.rename(
          `${envVariables.ATTACHMENT_FOLDER_PATH}/${file.originalname}`,
          dest,
          (err) => {
            if (err) throw err;
            console.log('Successfully moved');
          }
        );
      }

      resolve(true);
    });
  },

  getFile: (folderName, fileName) =>
    path.join(envVariables.ATTACHMENT_FOLDER_PATH, folderName, fileName),

  removeFile: (folderName, fileNameWithExtension) => {
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
