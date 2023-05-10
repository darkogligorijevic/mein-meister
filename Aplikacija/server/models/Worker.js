const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:"User", 
    required:true
  },
  phoneNumber:{type:Number,required:true},
  posts:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }
  ]
})

module.exports = mongoose.model('Worker',workerSchema);