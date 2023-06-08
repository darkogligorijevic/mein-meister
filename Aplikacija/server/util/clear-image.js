const fs = require('fs');
const path = require('path');

const HttpError = require('../models/HttpError');

module.exports = (filePath) => {
  let imagePath = path.join(__dirname, '..', filePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnje',500)
      return next(error)
    }
    console.log('File deleted successfully');
  });
};