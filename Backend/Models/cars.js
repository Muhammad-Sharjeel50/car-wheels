// models/Car.js
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  userId : String,
  category: String,
  color: String,
  model: String,
  make: String,
  registrationNo: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  name: String,
  image: {
    type: String,
    required: true,
  },
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
