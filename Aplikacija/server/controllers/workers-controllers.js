const Worker = require('../models/Worker')
const HttpError = require('../models/HttpError')

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postWorkerCreate = async (req,res,next) => {
  const {phone,userId} = req.body

  const newWorker = new Worker({
    phoneNumber:+phone,
    userId, //userId:userId --> hardcoded userId, promenicu kada dodam user auth, bice u req.userId
    imageUrl:"dummyUrl", //testa radi, kasnije ce biti u req.file.path
    posts:[]
  })

  let worker;
  try {
    worker = await Worker.findOne({userId:userId});
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
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(201).json({message:"You have successfully become a meister"})
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getWorkerAll = async (req,res,next) => {
  let workers;
  try {
    workers = await Worker.find({});
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
    worker = await Worker.findOne({_id:workerId});
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


  if(!worker) {
    const error = new HttpError("There is no such a worker, hence you can't delete it",404)
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
  const {workerId} = req.params;
  const {phone} = req.body;

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if(!worker) {
    console.log(worker)
    const error = new HttpError("There is no such a worker, hence you can't update it",404)
    return next(error)
  }

  console.log(worker)

  const updateWorker = {
    _id:worker._id,
    userId: worker.userId,
    phoneNumber:phone ? +phone : worker.phone,
    imageUrl:"Dummmy url", // kasnije preko req.file.path 
    posts:[...worker.posts]
  }

  console.log(updateWorker)

  try {
  await Worker.findOneAndUpdate({_id:workerId},updateWorker);
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }
  res.status(202).json({message:"Succesfully updated resource"})

}