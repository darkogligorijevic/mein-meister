const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  workerId: {type:mongoose.Schema.Types.ObjectId,ref:"Worker",required:true},
  postId: {type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},
  phoneNumber: {type:Number,required:true},
  description:{type:String,required:true}
})

module.exports = mongoose.model('Order',orderSchema);