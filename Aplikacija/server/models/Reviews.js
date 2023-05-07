const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  postId: {type: mongoose.Schema.Types.ObjectId, ref:'Post',required:true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref:'User',required:true},
  star: {type: Number, required:true},
  reviewText: {type: String, required:true}
})

module.exports = mongoose.model('Review',reviewSchema)
