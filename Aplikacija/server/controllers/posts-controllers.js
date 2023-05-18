const fs = require('fs')
const path = require('path')
const {validationResult} = require('express-validator')

const Post = require('../models/Post')
const Worker = require('../models/Worker')
const HttpError = require('../models/HttpError')

/////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postCreate = async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  if (!req.file) {
    const error = new HttpError('No image provided',422)
    return next(error)
  }
  const {workerId} = req.params
  const {title, description, city} = req.body

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if(!worker) {
    const error = new HttpError("There is no such a worker",404)
    return next(error)
  }

  const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const newPost = new Post({
    workerId, // workerId: workerId
    title,
    description,
    city,
    imageUrl: imageUrl 
  })

  let post;
  try {
    post = await newPost.save()
    console.log(post)
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  worker.posts.push(post._id)

  try {
    await worker.save()
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(201).json({message:"Succesfully added a post"})


}

////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPostAll = async (req,res,next) => {
  let posts;
  try {
    posts = await Post.find({}).populate({
      path: 'workerId',
      populate: {
        path: 'userId'
      }
    });
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(200).json(posts);
}

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
    }) //nested populate
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
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
    const error = new HttpError('Something went wrong',500)
     return next(error)
  }

  if(!post) {
    const error = new HttpError('There is no such a post',404)
     return next(error)
  }



  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
     return next(error)
  }
  // console.log(worker)
  // console.log(workerId, worker._id)
  // console.log(workerId,worker._id.toString())
  // console.log(workerId !== worker._id.toString())

  if(!worker || workerId !== post.workerId.toString()) {
    const error = new HttpError('There is no such a worker, or you didnt create that post',404)
     return next(error)
  }
  // console.log(worker.posts, postId) debug
  worker.posts = worker.posts.filter((idPost) => idPost.toString() !== postId)
  // console.log(worker.posts, postId) debug

  try {
    await worker.save()
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  // fs.unlink(post.imageUrl, (err) => {
  //   console.log(err)
  // })
  clearImage(post.imageUrl)

  try {
    await Post.findByIdAndDelete({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.json({message:"Successfully deleted post"})

}

//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.patchPostById = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {postId,workerId} = req.params;
  const {title,description,city} = req.body;
  let {imageUrl} = req.body;
  if(req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/")
    console.log('1')
  }
  if(!imageUrl) {
    console.log('2')
    const error = new HttpError('No file picked',422)
     return next(error)
  }
  

  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
     return next(error)
  }

  if(!post) {
    const error = new HttpError('There is no such a post',404)
     return next(error)
  }

  let worker;
  try {
    worker = await Worker.findOne({_id:workerId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
     return next(error)
  }

  if(!worker || workerId !== post.workerId.toString()) {
    const error = new HttpError('There is no such a worker, or you didnt create that post',404)
     return next(error)
  }

  console.log(imageUrl, post.imageUrl)
  console.log(imageUrl !== post.imageUrl)
  if (imageUrl !== post.imageUrl) {
    // fs.unlink(imageUrl, (err) => {
    //   console.log(err)
    // })
    clearImage(post.imageUrl)
  }

  const updatePost = {
    _id: post._id,
    workerId:post.workerId,
    imageUrl:imageUrl,
    title: title || post.title,
    description: description || post.description,
    city:city || post.city
  }

  try {
    await Post.findOneAndUpdate({_id:postId},updatePost);
    } catch(err) {
      const error = new HttpError('Something went wrong',500)
      return next(error)
    }


    res.status(202).json({message:"Succesffully updated post"})


}


const clearImage = (filePath, next) => {
  let imagePath = path.join(__dirname, '..', filePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      next(err);
      return;
    }
    console.log('File deleted successfully');
    next();
  });
};
