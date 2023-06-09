const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')


const User = require('../models/User');
const Worker = require('../models/Worker');
const Post = require('../models/Post');
const Review = require('../models/Reviews');
const Order = require('../models/Order');
const clearImage = require('../util/clear-image');
const HttpError = require('../models/HttpError');




//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postUserRegister = async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422)
    );
  }
  const {firstName, lastName, email, password, isAdministrator} = req.body;
  let existingUser
  try {
  existingUser = await User.findOne({email:email});
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500);
    return next(error);
  }
  if(existingUser) {
    const error = new HttpError('Korisnik sa takvim e-mail-om već postoji, probajte drugi, ili se ulogujte',422)
    return next(error);
  }

  let hashedPassword;
  try {
  hashedPassword = await bcrypt.hash(password,12);
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error);
  }


  const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;


  const newUser = new User({
    firstName,
    lastName,
    imageUrl,
    email,
    password:hashedPassword,
    isAdministrator
  })


  try {
  await newUser.save()
  } catch(err) {
  const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
  return next(error);
}

  

res.status(201).json({message:'Korisnik je uspešno kreiran',userId:newUser._id,email:newUser.email})

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.postUserLogin = async (req,res,next)=>{
  const {password,email} = req.body
  let user;
  try {
    user = await User.findOne({email:email})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error);
  }

  if(!user) {
    const error = new HttpError('Korisnik sa tim e-mail-om ne postoji, molimo da se registrujete',400)
    return next(error);
  }

  let isValid = false;
  try {
   isValid = await bcrypt.compare(password,user.password)
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error);
  }

  if(!isValid) {
    const error = new HttpError(
      'Invalidni podaci, ne možemo da vas ulogujemo',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({
      userId:user._id,email:user.email
    },
    process.env.SECRET_JWT,
    { expiresIn: '1h' }
    )
  } catch(err) {
    const error = new HttpError(
      'Neuspešno logovanje, molimo probajte kasnije',500);
    return next(error);
  }


  res.status(200).json({message:'Uspešno ste se ulogovali',userId:user._id,email:user.email,firstName:user.firstName,lastName:user.lastName,image:user.imageUrl,token:token, isMeister: user.isMeister, isAdministrator: user.isAdministrator})

}

////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.updateUserLogIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422)
    );
  }

  const { firstName, lastName, email } = req.body;
  let { imageUrl } = req.body;

  if (req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/");
  }

  if (!imageUrl) {
    const error = new HttpError('File nije izabran', 422);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ _id: req.userId });
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Takav korisnik ne postoji', 401);
    return next(error);
  }

  if (imageUrl !== user.imageUrl) {
    clearImage(user.imageUrl);
  }

  const updateUser = {
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    email: email || user.email,
    imageUrl: imageUrl
  };

  try {
    await User.findOneAndUpdate({ _id: user._id }, updateUser);
  } catch (err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije', 500);
    return next(error);
  }

  const updatedUser = {
    ...user.toObject(),
    ...updateUser
  };

  res.status(202).json({
    message: "Korisnik je uspešno promenio podatke",
    user: updatedUser
  });
};



//////////////////////////////////////////////////////////////////////////////////////////////

module.exports.updateUserPassword = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Podaci koje ste poslali nisu validni, molimo pošaljite validne podatke', 422)
    );
  }
  const {oldPassword, newPassword} = req.body

  let user;
  try {
    user = await User.findOne({_id:req.userId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error);
  }

  if(!user) {
    const error = new HttpError('Takav korisnik ne postoji',401)
    return next(error);
  }

  let isItSame;
  try {
  isItSame = await bcrypt.compare(oldPassword,user.password);
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije')
    return next(error);
  }


  let hashedPassword;
  if(isItSame) {
    try {
    hashedPassword = await bcrypt.hash(newPassword,12);
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije')
      return next(error);
    }
  } else {
    return next(new HttpError('Uneli ste pogrešnu sifru'))
  }

  user.password = hashedPassword;


 try {
    await user.save();
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error)
    }

    res.status(202).json({message:"Korisnik je uspešno promenio sifru"});

};

/////////////////////////////////////////////////////////////////////////////////////////////

module.exports.deleteUserLogin = async (req,res,next) => {
  let user;
  try {
    user = await User.findOne({_id:req.userId})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error);
  }

  if(!user) {
    const error = new HttpError('Takav korisnik ne postoji',401)
    return next(error);
  }

  if(user.isMeister) {
    let worker;
    try {
      worker = await Worker.findOne({userId:user._id});
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error);
    }

    if(!worker) {
      const error = new HttpError("Takav majstor ne postoji",404)
      return next(error)
    }

    let posts;
    try {
      posts = await Post.find({workerId:worker._id})
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error);
    }

    const output = posts.map((post)=>{
      clearImage(post.imageUrl);
    })


    try {
      await Post.deleteMany({workerId:worker._id})
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error);
    }

    try {
      await Worker.findOneAndDelete({_id:worker._id});
    } catch(err) {
      const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
      return next(error)
    }

  }

  try {
    await Order.deleteMany({userId:user._id})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  try {
    await Review.deleteMany({userId:user._id})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }



  // brisi i revies i orders
  
  clearImage(user.imageUrl)

  try {
    await User.findByIdAndDelete({_id:user._id})
  } catch(err) {
    const error = new HttpError('Nešto je pošlo naopako, molimo probajte kasnije',500)
    return next(error)
  }

  res.status(200).json({message:"Korisnik je izbrisan"})


  }