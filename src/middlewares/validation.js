import Joi from 'joi';

export const validateFileInput = Joi.object().keys({
  folderName: Joi.string().max(255).required().trim(),
  fileName: Joi.string().max(255).required().trim(),
  allowedExtensions: Joi.array()
    .items(Joi.string().max(255).required().trim())
    .min(1),
});
