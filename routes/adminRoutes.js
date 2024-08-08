const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');

router.post('/signin', async (req, res) => {
  const { name, password } = req.body;

  try {
    const admin = await Admin.findOne({ name });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Sign-in successful', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
