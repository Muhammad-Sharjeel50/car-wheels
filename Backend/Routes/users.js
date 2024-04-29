const express = require('express');
const router = express.Router();
const {registerUser , loginUser , getUser , getAllUsers , updateUser} = require('../Controllers/users.js');
const verifyAuth = require('../middleware/auth.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/user',verifyAuth, getUser);
router.post('/all-user',verifyAuth, getAllUsers);
router.post('/update-user',verifyAuth, updateUser);

module.exports = router;
