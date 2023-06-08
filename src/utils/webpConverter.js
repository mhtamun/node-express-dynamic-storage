import fs from 'fs';
import sharp from 'sharp';

export const convertToWebp = (dirPath, fileName, fileExtension, filePath) => {
  if (
    fileExtension.toLowerCase() === '.jpg' ||
    fileExtension.toLowerCase() === '.png' ||
    fileExtension.toLowerCase() === '.jpeg' ||
    fileExtension.toLowerCase() === '.JPG' ||
    fileExtension.toLowerCase() === '.JPEG' ||
    fileExtension.toLowerCase() === '.PNG'
  ) {
    const webpPath = `${dirPath}/${fileName}.webp`;
    const sharp_webp = sharp(filePath)
      .toFile(webpPath)
      .then((data) => {
        fs.unlinkSync(filePath);

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log('Please select jpg/jpeg/png image');
  }
};
