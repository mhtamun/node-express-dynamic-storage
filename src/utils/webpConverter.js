import fs from 'fs';
import sharp from 'sharp';

export const convertToWebp = (dirPath, fileName, filePath) => {
  const webpPath = `${dirPath}/${fileName}.webp`;
  const sharp_webp = sharp(filePath)
    .toFile(webpPath)
    .then((data) => {
      fs.unlinkSync(filePath);

      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      throw {
        name: 'internalServerError',
        message: error,
      };
    });
};
