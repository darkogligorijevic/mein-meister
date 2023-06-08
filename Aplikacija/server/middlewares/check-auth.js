const jwt = require('jsonwebtoken');
const HttpError = require('../models/HttpError');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer jwt
    
    console.log(token)

    if (!token) {
      throw new HttpError('Neuspesna autentifikacija!', 403);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
  
    req.userId = decodedToken.userId;

  
    next();
  } catch (err) {
    const error = new HttpError('Neuspesna autentifikacija', 403); 
    return next(error);
  }
};
