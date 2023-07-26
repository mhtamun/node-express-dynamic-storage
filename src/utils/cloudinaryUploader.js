import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';
import sharp from 'sharp';
import { Readable } from 'stream';
import envVariables from './env.js';
import fs from 'fs';

//cloudinary configuration
cloudinary.config({
  cloud_name: envVariables.CLOUDINARY_NAME,
  api_key: envVariables.CLOUDINARY_API_KEY,
  api_secret: envVariables.CLOUDINARY_API_SECRET,
});

//upload file
export const uploadToCloudinary = async (filePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath, options);
    console.log(result);
    fs.unlinkSync(filePath);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

//remove file
export const removeFromCloudinary = async (
  fileNameWithoutExtension,
  callBack
) => {
  await cloudinary.uploader.destroy(fileNameWithoutExtension, callBack);
};
