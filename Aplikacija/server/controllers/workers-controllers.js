const { validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');
const HttpError = require('../models/HttpError');

module.exports.postWorkerCreate = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422));
  }
  
  const { phone } = req.body;

  let user;
  try {
    user = await User.findById(req.userId);
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Korisnik ne postoji', 404);
    return next(error);
  }

  let existingWorker;
  try {
    existingWorker = await Worker.findOne({ userId: req.userId });
    if (existingWorker) {
      return next(new HttpError('Korisnik je već postao majstor', 422));
    }
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  const newWorker = new Worker({
    phoneNumber: phone,
    userId: req.userId,
    posts: []
  });

  
  try {
    await newWorker.save();
    user.isMeister = true; // set the isMeister field of the user to true
    await user.save(); // save the updated user document to the database
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }
  
  res.status(201).json({ message: 'Uspešno ste postali majstor', workerId: newWorker._id.toString() });
};




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getWorkerAll = async (req,res,next) => {
  let workers;
  try {
    workers = await Worker.find({}).populate('userId','-password')
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  res.status(200).json(workers);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getWorkerById = async (req,res,next) => {
  const {workerId} = req.params;

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId}).populate('userId','-password')
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  res.status(200).json(worker);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getWorkerByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let worker;
  try {
    worker = await Worker.findOne({ userId }).populate('userId', '-password');
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  if (!worker) {
    const error = new HttpError('Majstor nije pronađen', 404);
    return next(error);
  }

  res.status(200).json(worker);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


