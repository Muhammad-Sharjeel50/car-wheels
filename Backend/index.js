const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userAuth =require('./Routes/users.js');
const cars =require('./Routes/cars.js');
dotenv.config();
 
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 5000;
app.use('/v1/user', userAuth);
app.use('/v1/cars', cars);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(port, () => console.log(`Server listening on port ${port}`));
