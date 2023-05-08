const {validationResult} = require('express-validator')

const Order = require('../models/Order');
const Post = require('../models/Post');
const HttpError = require('../models/HttpError')

///////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postOrderByPostId = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {postId} = req.params;
  const {phoneNumber,description} = req.body;
  let post;
  try {
    post = await Post.findOne({_id:postId})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if(!post) {
    const error = new HttpError("There is no such a post",404)
    return next(error)
  }



  const newOrder = new Order({
    userId:req.userId, 
    postId, //postId:postId
    phoneNumber:+phoneNumber,
    description
  })

  try {
    await newOrder.save()
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(201).json({message:"Order is added"})

}

///////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getOrderById = async (req,res,next) => {
  const {orderId} = req.params;
  let order;
  try {
    order = await Order.findOne({_id:orderId})
    .populate('userId','-_id ')
    .populate('postId','-_id -workerId')
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  if(!order) {
    const error = new HttpError('There is no such an order',404)
    return next(error)
  }

  res.status(200).json(order);

}

///////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getOrdersByPostId = async (req,res,next) => {
  const {postId} = req.params
  let orders;
  try {
    orders = await Order.find({postId:postId})
    .populate('userId','-_id ')
    .populate('postId','-_id -workerId')
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error)
  }

  res.status(200).json(orders)
}

////////////////////////////////////////////////////////////////////////////////////////////////