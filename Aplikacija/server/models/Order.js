const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  postId: {type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},
  phoneNumber: {type:Number,required:true},
  description:{type:String,required:true}
})

module.exports = mongoose.model('Order',orderSchema);