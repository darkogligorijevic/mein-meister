const {validationResult} = require('express-validator')

const HttpError = require('../models/HttpError')
const Post = require('../models/Post');
const Review = require('../models/Reviews')

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.postReviewByPostId = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {postId} = req.params
  const {star, reviewText} = req.body

  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if (!post) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  let review;
  try {
    review = await Review.findOne({userId:req.userId,postId:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if(review) {
    const error = new HttpError('You have already create a review for such a post',409)
    return next(error)
  }

  const newReview = new Review({
    postId, //postId:postId
    userId:req.userId, // kasnije u cu u req da dobijem userId ovo je samo testa radi
    star: +star,
    reviewText
  })

  try {
    await newReview.save()
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(201).json({message:"Review has been added"})
}

/////////////////////////////////////////////////////////////////////////////////////////////

module.exports.patchReviewByPostId = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {postId,reviewId} = req.params
  const {star, reviewText} = req.body
  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if (!post) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  let review;
  try {
    review = await Review.findOne({_id:reviewId})
  } catch(err) {
    
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }


  // console.log(!review)
  // console.log(review.userId.toString() !== req.userid)
    // console.log(review.userId.toString() !== req.userId)
  // console.log(review.postId.toString() !== postId)
  // console.log(typeof userId,typeof review.userId.toString())

  if (!review || review.userId.toString() !== req.userId || review.postId.toString() !== postId) {
    const error = new HttpError('There is no such a review for this post, or you are not allowed to update this review',404)
    return next(error)
  }



  const updateReview = new Review({
    _id:review._id,
    postId, //postId:postId
    userId:review.userId, // kasnije u cu u req da dobijem userId ovo je samo testa radi
    star: star || review.star,
    reviewText: reviewText || review.reviewText
  })


  try {
    await Review.findOneAndUpdate({_id:reviewId},updateReview);
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(200).json({message:"Review has been updated"})

}

/////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getReviewsByPostId = async (req,res,next) => {
  const {postId} = req.params
  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if (!post) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  let reviews;
  try {
    reviews = await Review.find({postId:postId})
    .populate('postId','-_id')
    .populate('userId','-_id')
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(200).json(reviews);
}

/////////////////////////////////////////////////////////////////////////////////////////////

module.exports.deleteReviewByPostId = async (req,res,next) => {
  const {reviewId} = req.params;

  let review;
  try {
    review = await Review.findOne({_id:reviewId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }



  if (!review || review.userId.toString() !== req.userId ) {
 
    const error = new HttpError('There is no such a review , or you are not allowed to delete this review',404)
    return next(error)
  }

  try {
    await Review.findOneAndDelete({_id:reviewId})
  } catch(err) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  res.status(200).json({message:"Review has been deleted"})


}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.getReviewsAverage = async (req,res,next) => {
  const {postId} = req.params
  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if (!post) {
    const error = new HttpError('There is no such a post',404)
    return next(error)
  }

  let reviews;
  try {
    reviews = await Review.find({postId:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  const length = reviews.length
  const sum = reviews.reduce((acc,curr)=>{
    return acc += curr.star;
  },0)


  res.status(200).json({average:sum/length});

}
