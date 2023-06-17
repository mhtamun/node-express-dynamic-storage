import fs from 'fs';
import sharp from 'sharp';

export const convertToWebp = (dirPath, fileName, file) => {
  const webpPath = `${dirPath}/${fileName}.webp`;

  const sharp_webp = sharp(file.destination + '/' + file.originalname)
    .toFile(webpPath)
    .then((data) => {
      fs.unlinkSync(file.path);

      console.log(data);

      return webpPath;
    })
    .catch((error) => {
      console.error(error);

      throw {
        name: 'internalServerError',
        message: error,
      };
    });
};
