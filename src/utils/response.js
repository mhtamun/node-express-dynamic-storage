export const httpResponse = (response, name, message, data) => {
  if (name === 'badRequest') {
    return response.status(400).json({ statusCode: 400, message, data });
  }

  if (name === 'unauthorized') {
    return response.status(401).json({ statusCode: 401, message, data });
  }

  if (name === 'forbidden') {
    return response.status(403).json({ statusCode: 403, message, data });
  }

  if (name === 'notFound') {
    return response.status(404).json({ statusCode: 404, message, data });
  }

  if (name === 'success') {
    return response.status(200).json({ statusCode: 200, message, data });
  }

  return response.status(500).json({
    statusCode: 500,
    message: 'Something went wrong, please have patient and try again.',
  });
};
