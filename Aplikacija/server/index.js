require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const HttpError = require('./models/HttpError')

const app = express()


app.use(bodyParser.json({extended:false}));


app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept,Authorization')
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE')
 next(); 
})


app.use('/api/posts',);
app.use('/api/users',);
app.use('/api/reviews',);
app.use('/api/orders',);

app.use((req,res,next)=>{
  const error = new HttpError('There is no such a route, please enter valid url',404)
  throw error
})

app.use((error,req,res,next)=>{
  res.status(error.code || 500 )
  .json({message: error.message || 'A problem occured'})
})




mongoose.connect(process.env.MONGODB_URI).then((client)=>{
  app.listen(process.env.PORT || 5000)
  console.log('Server is upp and running')
})
.catch((err)=>{
  const error = new HttpError("Can't connect to database, please try again later",500)
  return next (error)
})

