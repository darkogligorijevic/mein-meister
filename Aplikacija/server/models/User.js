const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {type:String,required:true},
  lastName: {type:String,required:true},
  imageUrl: {type:String},
  email:{type:String,required:true},
  password:{type:String,required:true},
  isMeister: {type:Boolean, default:false},
  isAdministrator: {type:Boolean, default:false}
})

module.exports = mongoose.model('User',userSchema);