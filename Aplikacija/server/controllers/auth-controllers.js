const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')


const User = require('../models/User')
const HttpError = require('../models/HttpError')



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postUserRegister = async (req,res,next)=>{
  console.log(req.headers)
  console.log(req.body)
  console.log(req.file)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const {firstName, lastName, email, password} = req.body;
  let existingUser
  try {
  existingUser = await User.findOne({email:email})
  } catch(err) {
    const error = new HttpError('Something went wrong',500)
    return next(error);
  }
  if(existingUser) {
    const error = new HttpError('Such a user already exists, please try to log in',422)
    return next(error)
  }

  let hashedPassword;
  try {
  hashedPassword = await bcrypt.hash(password,12);
  } catch(err) {
    const error = new HttpError('Something went wrong')
    return next(error);
  }


  const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

  console.log(typeof imageUrl)

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    imageUrl: imageUrl,
    email: email,
    password:hashedPassword
  })


  try {
  await newUser.save()
  } catch(err) {
  const error = new HttpError('Something went wrong, please try again later',500)
  return next(error);
}

  

res.json({message:'Successfully created user',userId:newUser._id,email:newUser.email})

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postUserLogin = async (req,res,next)=>{
  const {password,email} = req.body
  let user;
  try {
    user = await User.findOne({email:email})
  } catch(err) {
    const error = new HttpError('Loggin in failed, please try again later',500)
    return next(error);
  }

  if(!user) {
    const error = new HttpError('There is no such a user, please signup first',401)
    return next(error);
  }

  let isValid = false;
  try {
   isValid = await bcrypt.compare(password,user.password)
  } catch(err) {
    const error = new HttpError('Something went wrong')
    return next(error);
  }

  if(!isValid) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({userId:user._id,email:user.email},process.env.SECRET_JWT)
  } catch(err) {
    const error = new HttpError(
      'Loging in failed, please try again later.',500);
    return next(error);
  }

  // update user isMeister field if worker is associated with this user
  try {
    await User.findOneAndUpdate({_id: req.userId, isMeister: false}, {isMeister: true});
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user', 500);
    return next(error);
  }

  res.status(200).json({message:'Successfully logged in',userId:user._id,email:user.email,firstName:user.firstName,lastName:user.lastName,image:user.imageUrl,token:token, isMeister: user.isMeister})

}