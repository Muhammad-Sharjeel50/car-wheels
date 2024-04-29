const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/users.js');
const nodemailer = require('nodemailer');

const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const password = generateRandomPassword();

    const newUser = new User({ firstName, lastName, email, password});
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Car Wheels Platform',
      html: `<p>Hello ${firstName + lastName},</p>
             <p>Welcome to our Car Wheels! Your login details are:</p>
             <p>Email: ${email}</p>
             <p>Password: ${password}</p>
             <p>Please keep your login details secure.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'User created successfully', token, newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password directly with the stored password (not recommended)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the password matches, generate a JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ message: 'Login successful', token, name: user.firstName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = loginUser;


module.exports = loginUser;


const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email } = req.body;

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details based on provided fields using findByIdAndUpdate
    await User.findByIdAndUpdate(userId, {
      $set: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
      },
    });

    // Fetch the updated user data
    const updatedUser = await User.findById(userId);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUser, getAllUsers, updateUser };
