export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res
      .status(400)
      .json({ statusCode: 400, message: error.details[0].message });
  } else {
    next();
  }
};
