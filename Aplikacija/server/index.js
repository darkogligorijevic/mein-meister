const fs = require('fs');
const path = require('path');
const http = require('http');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const HttpError = require('./models/HttpError');
const authRoutes = require('./routes/auth-routes');
const workerRoutes = require('./routes/workers-routes');
const postRoutes = require('./routes/posts-routes');
const orderRoutes = require('./routes/orders-routes');
const reviewRoutes = require('./routes/reviews-routes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use('/public/images', express.static(path.join('public', 'images')));
app.use(bodyParser.json({ extended: false })); // application/json
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept,Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
// if(req.method === 'OPTIONS) {
//   return next();
// }
//   next();
// });
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Molimo unesite validan URL', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  res.status(error.code || 500)
    .json({ message: error.message || 'Desio se problem' });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log('Server is up and running');
  });
}).catch((err) => {
  const error = new HttpError("Ne možemo da se povežemo sa bazom, molimo probajte kasnije", 500);
  throw error;
});

// Socket.IO integration
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

