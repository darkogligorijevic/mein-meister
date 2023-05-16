const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   workerId :{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Worker",
          required:true},
   title:{type:String, required:true},
   description:{type:String,required:true},
   imageUrl:{type:String,required:true},
   city:{type:String,required:true},
   category: {type:String, required:true}   
},{ timestamps: true })

module.exports = mongoose.model('Post',postSchema);