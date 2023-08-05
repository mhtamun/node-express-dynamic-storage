import envVariables from '../utils/env.js';
import { fileUtil } from '../utils/file.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import { httpResponse } from '../utils/response.js';

const {
  getFileExtension,
  checkFileExists,
  saveFile,
  getFile,
  removeFile,
  validateFile,
} = fileUtil;

const tag = 'services/file.js';

//upload file
export const uploadFile = async (req, res) => {
  let file;
  try {
    const { folderName, fileName, allowedExtensions } = req.body;
    file = req.file;

    validateFile(file, allowedExtensions);

    const fileExtension = getFileExtension(file.originalname);

    const isFileExists = await checkFileExists(
      folderName,
      fileName,
      fileExtension
    );

    const fileNameRandom = !fileName
      ? file.originalname.split('.')[0]
      : fileName;

    if (isFileExists)
      throw {
        name: 'badRequest',
        message: 'A file is already exits with this name!',
      };

    await saveFile(folderName, fileNameRandom, fileExtension, file);

    httpResponse(res, 'success', 'File uploaded successfully!', {
      url:
        envVariables.PUBLIC_URL +
        `/content/folders/${folderName}/files/${fileNameRandom}.${fileExtension}`,
      localUrl:
        envVariables.LOCAL_URL +
        `/content/folders/${folderName}/files/${fileNameRandom}.${fileExtension}`,
    });
  } catch (error) {
    file.path && fs.unlinkSync(file.path);

    logger.error(tag + ': add', error);

    httpResponse(res, '', error.message);
  }
};

//get file
export const fetchFile = async (req, res) => {
  try {
    const { folderName, fileName } = req.params;

    const file = getFile(folderName, fileName);

    httpResponse(res, 'success', 'File fetched successfully', file);
  } catch (error) {
    logger.error(tag + ': get', error);

    httpResponse(res, '', error.message);
  }
};

//update file
export const updateFile = async (req, res) => {
  const isCloudinary = true;
  let file;
  try {
    const {
      folderName: newFolderName,
      fileName: newFileName,
      allowedExtensions,
    } = req.body;

    file = req.file;

    const { folderName: oldFolderName, fileName: oldFileName } = req.params;

    validateFile(file, allowedExtensions);

    if (!isCloudinary) {
      const isFileExists = await checkFileExists(
        oldFolderName,
        oldFileName.split('.')[0],
        oldFileName.split('.')[1]
      );

      if (!isFileExists)
        throw {
          name: 'badRequest',
          message: 'File not found to replace!',
        };
    }

    await removeFile(oldFolderName, oldFileName);

    const fileExtension = getFileExtension(file && file.originalname);

    await saveFile(newFolderName, newFileName, fileExtension, file);

    httpResponse(res, 'success', 'File updated successfully', {
      url:
        envVariables.PUBLIC_URL +
        `/content/folders/${newFolderName}/files/${newFileName}.${fileExtension}`,
      localUrl:
        envVariables.LOCAL_URL +
        `/content/folders/${newFolderName}/files/${newFileName}.${fileExtension}`,
    });
  } catch (error) {
    file.path && fs.unlinkSync(file.path);

    logger.error(tag + ': edit', error);

    httpResponse(res, '', error.message);
  }
};

//delete file
export const deleteFile = async (req, res) => {
  const isCloudinary = true;
  try {
    const { folderName, fileName } = req.params;

    if (!isCloudinary) {
      const isFileExists = await checkFileExists(
        folderName,
        fileName.split('.')[0],
        fileName.split('.')[1]
      );

      if (!isFileExists)
        throw {
          name: 'badRequest',
          message: 'File not found to delete!',
        };
    }

    await removeFile(folderName, fileName);

    httpResponse(res, 'success', 'File is deleted');
  } catch (error) {
    logger.error(tag + ': edit', error);

    httpResponse(res, '', error.message);
  }
};
