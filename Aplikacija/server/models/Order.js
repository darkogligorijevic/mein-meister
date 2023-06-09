const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  postId: {type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},
  workerId: {type:mongoose.Schema.Types.ObjectId,ref:"Worker",required:true},
  phoneNumber: {type:String,required:true},
  description:{type:String,required:true},
  isAccepted: {type:Boolean, default:false},
  scheduledDate: {type:Date}
},{ timestamps: true })

module.exports = mongoose.model('Order',orderSchema);