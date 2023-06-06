import { fileUtil } from '../utils/file.js';

const { getFileExtension, checkFileExists, saveFile, getFile } = fileUtil;

//upload file
export const uploadFile = async (req, res) => {
  try {
    const { folderName, fileName, file, allowedExtensions } = req.body;

    validateFile(file, allowedExtensions);

    const fileExtension = getFileExtension(file.originalname);

    const isFileExists = await checkFileExists(
      folderName,
      fileName + '.' + fileExtension
    );

    const fileNameRandom = !fileName ? file.filename : fileName;

    if (isFileExists)
      throw {
        name: 'badRequest',
        message: 'A file is already exits with this name!',
      };

    await saveFile(folderName, fileNameRandom, fileExtension, file);

    return {
      success: true,
      data: {
        url:
          PUBLIC_URL +
          `/content/folders/${folderName}/files/${fileNameRandom}.${fileExtension}`,
        localUrl:
          LOCAL_URL +
          `/content/folders/${folderName}/files/${fileNameRandom}.${fileExtension}`,
      },
    };
  } catch (error) {
    logger.error(tag + ': add', error);

    return { success: false, data: error };
  }
};

//get file
export const fetchFile = async (req, res) => {
  try {
    const { folderName, fileName } = req.body;

    const file = getFile(folderName, fileName);

    return { success: true, data: file };
  } catch (error) {
    logger.error(tag + ': get', error);

    return { success: false, data: error };
  }
};

//update file
export const updateFile = async (req, res) => {
  try {
    const {
      folderName: newFolderName,
      fileName: newFileName,
      file,
      allowedExtensions,
    } = req.body;

    const { folderName: oldFolderName, fileName: oldFileName } = req.params;

    validateFile(file, allowedExtensions);

    const isFileExists = await checkFileExists(oldFolderName, oldFileName);

    if (!isFileExists)
      throw {
        name: 'badRequest',
        message: 'File not found to replace!',
      };

    await deleteFile(oldFolderName, oldFileName);

    const fileExtension = getFileExtension(file && file.originalname);

    await saveFile(newFolderName, newFileName, fileExtension, file);

    return {
      success: true,
      data: {
        url:
          PUBLIC_URL +
          `/content/folders/${newFolderName}/files/${newFileName}.${fileExtension}`,
        localUrl:
          LOCAL_URL +
          `/content/folders/${newFolderName}/files/${newFileName}.${fileExtension}`,
      },
    };
  } catch (error) {
    logger.error(tag + ': edit', error);

    return { success: false, data: error };
  }
};

//delete file
export const deleteFile = async (req, res) => {
  try {
    const { folderName, fileName } = req.params;

    const isFileExists = await checkFileExists(folderName, fileName);

    if (!isFileExists)
      throw {
        name: 'badRequest',
        message: 'File not found to delete!',
      };

    await deleteFile(folderName, fileName);

    return { success: true };
  } catch (error) {
    logger.error(tag + ': edit', error);

    return { success: false, data: error };
  }
};
