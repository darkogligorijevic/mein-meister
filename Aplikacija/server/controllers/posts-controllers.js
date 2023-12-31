
const {validationResult} = require('express-validator')

const Post = require('../models/Post');
const Worker = require('../models/Worker');
const clearImage = require('../util/clear-image');
const HttpError = require('../models/HttpError');

/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postCreate = async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422)
    );
  }
  if (!req.file) {
    const error = new HttpError('File nije izabran',422)
    return next(error)
  }
  const {workerId} = req.params
  const {title, description, city, category, price, hireInfo} = req.body

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  if(!worker) {
    const error = new HttpError("Takav majstor ne postoji",404)
    return next(error)
  }

  const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const newPost = new Post({
    workerId, // workerId: workerId
    title,
    description,
    city,
    category,
    price,
    hireInfo,
    imageUrl: imageUrl 
  })


  let post;
  try {
    post = await newPost.save()
    console.log(post)
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  worker.posts.push(post._id)

  try {
    await worker.save()
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  res.status(201).json({message:"Uspešno ste kreirali post"})


}

////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPostAll = async (req, res, next) => {
  const { cat, city } = req.query;

  let query = {};

  if (cat) {
    query.category = cat;
  }

  if (city) {
    query.city = city;
  }

  let posts;
  try {
    posts = await Post.find(query).populate({
      path: 'workerId',
      populate: {
        path: 'userId',
      },
    });
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  res.status(200).json(posts);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPostById = async (req,res,next) => {
  const {postId} = req.params
  let post;
  try {
    post = await Post.findOne({_id:postId}).populate({
      path: 'workerId',
      populate: {
        path: 'userId'
      }
    }) 
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  if (!post) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  res.status(200).json(post);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPostByWorkerAll = async (req,res,next) => {
  const {workerId} = req.params;
  let postsByWorker;
  try {
    postsByWorker =  await Post.find({workerId:workerId}).populate('workerId') //nested populate
   } catch(err) {
     const error = new HttpError('Something went wrong',500)
     return next(error)
   }

   res.status(200).json(postsByWorker)

}

///////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.deletePostById = async (req,res,next) => {
  const {postId, workerId} = req.params
  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
     return next(error)
  }

  if(!post) {
    const error = new HttpError('Nije pronađen takav post',404)
     return next(error)
  }



  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
     return next(error)
  }


  if(!worker || workerId !== post.workerId.toString()) {
    const error = new HttpError('Ne postoji takav majstor, ili ne možete da izbrišete post koji niste napravili',404)
     return next(error)
  }

  worker.posts = worker.posts.filter((idPost) => idPost.toString() !== postId)


  try {
    await worker.save()
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }


  clearImage(post.imageUrl)

  try {
    await Post.findByIdAndDelete({_id:postId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  res.status(200).json({message:"Post je uspešno izbrisan"})

}

//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.patchPostById = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422)
    );
  }
  const {postId, workerId} = req.params;
  const {title, description, city, category, price, hireInfo} = req.body;
  let {imageUrl} = req.body;
  if(req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/")
  }
  if(!imageUrl) {
    const error = new HttpError('File nije izabran',422)
     return next(error)
  }
  

  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
     return next(error)
  }

  if(!post) {
    const error = new HttpError('Ne postoji takav post',404)
     return next(error)
  }

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
     return next(error)
  }

  if(!worker || workerId !== post.workerId.toString()) {
    const error = new HttpError('Ne postoji takav majstor, ili ne možete da izbrišete post koji niste napravili',404)
     return next(error)
  }

  
  if (imageUrl !== post.imageUrl) {
   
    clearImage(post.imageUrl)
  }

  const updatePost = {
    _id: post._id,
    workerId:post.workerId,
    imageUrl:imageUrl,
    title: title || post.title,
    description: description || post.description,
    city:city || post.city,
    category:category || post.category,
    price: price || post.price,
    hireInfo: hireInfo || post.hireInfo,
  }

  try {
    await Post.findOneAndUpdate({_id:postId},updatePost);
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error)
    }


    res.status(202).json({message:"Uspešno ste izmenili post"})


}



