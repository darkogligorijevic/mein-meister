require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/HttpError')

const app = express()


mongoose.connect(process.env.MONGODB_URI).then((client)=>{
  app.listen(process.env.PORT || 5000)
  console.log('Server is upp and running')
})
.catch((err)=>{
  const error = new HttpError("Can't connect to database, please try again later",500)
  next (error)
})


