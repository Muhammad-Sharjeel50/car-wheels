// controllers/carController.js
const Car = require('../Models/cars.js');

// Create a new car
const createCar = async (req, res) => {
  try {
    const { category, color, model, make, registrationNo, price, name , userId } = req.body;
  
    const existingCar = await Car.findOne({ registrationNo });
    if (existingCar) {
      return res.status(400).json({ message: 'A car with this registration number already exists' });
    }

    const newCar = new Car({
      userId,
      category,
      color,
      model,
      make,
      registrationNo,
      price,
      name,
      image: req.file.path, // Multer stores the file path in req.file.path
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find() // Populate category field with name from Category model
    res.status(200).json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a car by ID
const getCarById  = async (req, res) => {
  try {
    const userId = req.params.id;
    const cars = await Car.find({ userId }); // Find all cars with the specified userId
    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: 'No cars found for this user' });
    }
    res.status(200).json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Update a car by ID
const updateCarById = async (req, res) => {
  try {
    const carId = req.params.id;
    const { category, color, model, make, registrationNo, price, name } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { category, color, model, make, registrationNo, price, name },
      { new: true }
    ).populate('category', 'name'); // Populate category field with name from Category model
    res.status(200).json(updatedCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a car by ID
const deleteCarById = async (req, res) => {
  try {
    const carId = req.params.id;
    await Car.findByIdAndDelete(carId);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
};
