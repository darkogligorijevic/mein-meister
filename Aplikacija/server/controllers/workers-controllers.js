const {validationResult} = require('express-validator')

const Worker = require('../models/Worker')
const HttpError = require('../models/HttpError')

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postWorkerCreate = async (req,res,next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {phone} = req.body
  console.log(req.userId)

  const newWorker = new Worker({
    phoneNumber:+phone,
    userId:req.userId, //userId:userId --> hardcoded userId, promenicu kada dodam user auth, bice u req.userId
    posts:[]
  })

  let worker;
  try {
    worker = await Worker.findOne({userId:req.userId});
  } catch (err) {
  
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if (worker) {
    const error = new HttpError("You have already become a maister",404)
    return next(error)
  }

  try {
  await newWorker.save()
  } catch(err) {
    console.log('2')
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(201).json({message:"You have successfully become a meister"})
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getWorkerAll = async (req,res,next) => {
  let workers;
  try {
    workers = await Worker.find({}).populate('userId','-password')
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
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
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(200).json(worker);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.deleteWorkerById = async (req,res,next) => {
  const {workerId} = req.params;

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  console.log(worker.userId, req.userId)
  if(!worker || worker.userId.toString() !== req.userId.toString()) {
    const error = new HttpError("There is no such a worker, or you are not allowed to delete this worker",404)
    return next(error)
  }

  try {
    await Worker.findOneAndDelete({_id:workerId});
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }
  
  res.json({message:"Meister is deleted."})

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.patchWorkerById = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {workerId} = req.params;
  const {phone} = req.body;

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  console.log(worker.userId,req.userId)
  if(!worker || worker.userId.toString() !== req.userId.toString()) {
    const error = new HttpError("There is no such a worker, or you are not allowed to update this worker",404)
    return next(error)
  }



  const updateWorker = {
    _id:worker._id,
    userId: worker.userId,
    phoneNumber:phone ? +phone : worker.phone,
    posts:[...worker.posts]
  }


  try {
  await Worker.findOneAndUpdate({_id:workerId},updateWorker);
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }
  res.status(202).json({message:"Succesfully updated resource"})

}