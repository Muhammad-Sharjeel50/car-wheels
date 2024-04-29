import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
const CarRegistration = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [color, setColor] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carImage, setCarImage] = useState(null);
  const history = useNavigate();

  const API_URL = new URL(process.env.REACT_APP_API_URL).origin;
  const token = localStorage.getItem('user');
  const decoded = jwtDecode(token);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('userId', decoded._id);
    formData.append('category', selectedCategory);
    formData.append('color', color);
    formData.append('model', selectedModel);
    formData.append('make', selectedMake);
    formData.append('registrationNo', registrationNo);
    formData.append('name', carName);
    formData.append('price', carPrice);
    formData.append('carImage', carImage);

    try {
      const response = await axios.post(`${API_URL}/v1/cars/add-car`, formData);
      toast.success('Car registered successfully!');
      history('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to register car');
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedMake('');
    setSelectedModel('');
  };

  const handleMakeChange = (event) => {
    const make = event.target.value;
    setSelectedMake(make);
    setSelectedModel('');
  };

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setCarImage(image);
  };

  const categoryOptions = [
    { value: 'SUV', label: 'SUV' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'PickupTruck', label: 'Pickup Truck' },
    { value: 'HybridCar', label: 'Hybrid Car' },
    { value: 'FullSizeSUV', label: 'Full-Size SUV' },
    { value: 'CompactCar', label: 'Compact Car' },
    { value: 'MidsizeSedan', label: 'Midsize Sedan' },
    { value: 'Minivan', label: 'Minivan' },
    { value: 'SportsCar', label: 'Sports Car' },
    { value: 'CrossoverSUV', label: 'Crossover SUV' },
    { value: 'CompactSUV', label: 'Compact SUV' },
    { value: 'MidsizeSUV', label: 'Midsize SUV' },
  ];

  const makeOptions = {
    SUV: ['Toyota', 'Honda', 'Ford', 'Chevrolet'],
    Sedan: ['Toyota', 'Honda', 'Ford'],
    PickupTruck: ['Toyota', 'Honda', 'Ford', 'Chevrolet'],
    HybridCar: ['Toyota'],
    FullSizeSUV: ['Toyota', 'Chevrolet'],
    CompactCar: ['Honda', 'Chevrolet'],
    MidsizeSedan: ['Honda'],
    Minivan: ['Honda'],
    SportsCar: ['Ford', 'Chevrolet'],
    CrossoverSUV: ['Ford', 'Chevrolet'],
    CompactSUV: ['Chevrolet'],
    MidsizeSUV: ['Chevrolet'],
  };

  const modelOptions = {
    Toyota: ['Camry', 'RAV4', 'Tacoma', 'Prius', 'Land Cruiser'],
    Honda: ['Civic', 'Accord', 'Pilot', 'Odyssey', 'Ridgeline'],
    Ford: ['Mustang', 'Explorer', 'Fusion', 'F-150', 'Escape'],
    Chevrolet: ['Silverado', 'Equinox', 'Camaro', 'Tahoe', 'Traverse'],
  };

  const colorOptions = ['Red', 'Blue', 'Green', 'White', 'Black'];

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            <span className="bg-gradient-to-r text-transparent font-bold from-blue-500 to-purple-500 bg-clip-text">
              Car Registration
            </span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option  value="" disabled>Select category</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="make" className="block text-gray-700 text-sm font-bold mb-2">
                Make
              </label>
              <select
                id="make"
                name="make"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleMakeChange}
                value={selectedMake}
                disabled={!selectedCategory}
              >
                <option value="" disabled>Select make</option>
                {selectedCategory &&
                  makeOptions[selectedCategory]?.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">
                Model
              </label>
              <select
                id="model"
                name="model"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleModelChange}
                value={selectedModel}
                disabled={!selectedMake}
              >
                <option value="" disabled>Select model</option>
                {selectedMake &&
                  modelOptions[selectedMake]?.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">
                Color
              </label>
              <select
                id="color"
                name="color"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setColor(e.target.value)}
                value={color}
              >
                <option value="" disabled>Select color</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="registrationNo" className="block text-gray-700 text-sm font-bold mb-2">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNo"
                name="registrationNo"
                required
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter registration number"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="carName" className="block text-gray-700 text-sm font-bold mb-2">
                Car Name
              </label>
              <input
                type="text"
                id="carName"
                name="carName"
                required
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter car name"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="carPrice" className="block text-gray-700 text-sm font-bold mb-2">
                Car Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter car price"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="carImage" className="block text-gray-700 text-sm font-bold mb-2">
                Car Image
              </label>
              <input
                type="file"
                id="carImage"
                name="carImage"
                required
                accept="image/*"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {carImage && (
                <img
                  src={URL.createObjectURL(carImage)}
                  alt="Car Image"
                  style={{ width: '100px', height: '100px' }}
                  className="mt-2"
                />
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Register Car
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CarRegistration;
