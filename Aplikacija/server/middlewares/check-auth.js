const jwt = require('jsonwebtoken');
const HttpError = require('../models/HttpError');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    console.log(req.headers.authorization)
    const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer jwt
    
    if (!token) {
      throw new HttpError('Authentication failed!', 403);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed', 403); 
    console.error(err);
    console.error(err.stack);
    return next(error);
  }
};
