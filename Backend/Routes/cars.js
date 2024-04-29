const express = require('express');
const router = express.Router();
const carController = require('../controllers/cars.js');
const multer = require('multer');

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('carImage'); // Use .single() for single file uploads

// Create a new car
router.post('/add-car', upload, carController.createCar);

// Get all cars
router.get('/all-cars', carController.getAllCars);

// Get a car by ID
router.get('/get-cars/:id', carController.getCarById);

// Update a car by ID
router.put('/update-cars/:id', carController.updateCarById);

// Delete a car by ID
router.delete('/delete-cars/:id', carController.deleteCarById);

module.exports = router;
