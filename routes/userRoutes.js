const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary

const router = express.Router();

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// router.post('/signup', upload.fields([
//   { name: 'logo', maxCount: 1 },
//   { name: 'crFile', maxCount: 1 },
//   { name: 'academyImg', maxCount: 1 }
// ]), async (req, res) => {
//   const { username, email, phoneNumber, password, fullName, designation, licenseNo, description, location, agreeTerms } = req.body;

//   const files = req.files;
//   const fileBase64 = {};

//   if (files) {
//     if (files.logo) fileBase64.logo = files.logo[0].buffer.toString('base64');
//     if (files.crFile) fileBase64.crFile = files.crFile[0].buffer.toString('base64');
//     if (files.academyImg) fileBase64.academyImg = files.academyImg[0].buffer.toString('base64');
//   }

//   try {
//     const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User with this email or phone number already exists.' });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new User({
//       username,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       fullName,
//       designation,
//       logo: fileBase64.logo,
//       crFile: fileBase64.crFile,
//       licenseNo,
//       academyImg: fileBase64.academyImg,
//       description,
//       location,
//       agreeTerms,
//       });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });


router.post('/signup', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'crFile', maxCount: 1 },
  { name: 'academyImg', maxCount: 1 }
]), async (req, res) => {
  const { username, email, phoneNumber, fullName, designation, description, location, website,licenseNo, instaId, agreeTerms } = req.body;

  const files = req.files;
  const fileBase64 = {};

  if (files) {
    if (files.logo) fileBase64.logo = files.logo[0].buffer.toString('base64');
    if (files.crFile) fileBase64.crFile = files.crFile[0].buffer.toString('base64');
    if (files.academyImg) fileBase64.academyImg = files.academyImg[0].buffer.toString('base64');
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists.' });
    }

    // Construct the new user object based on the updated schema
    const newUser = new User({
      username,
      email,
      phoneNumber,
      fullName,
      designation,
      description,
      location,
      licenseNo,
      website: website || null, // Optional
      instaId: instaId || null, // Optional
      logo: fileBase64.logo,
      crFile: fileBase64.crFile,
      academyImg: fileBase64.academyImg,
      agreeTerms: agreeTerms === 'true', // Ensure agreeTerms is parsed as a Boolean
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});
// Sign-In Route
router.post('/signin', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find the user by email or phone number
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Eemail/phone is incorrect' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Successful sign-in
    res.status(200).json({ message: 'Sign-in successful', user });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search Route
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Find the user by email or phone number
    const user = await User.findOne({
      $or: [{ email: query }, { phoneNumber: query }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send the user details
    res.status(200).json(user);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// New route to get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}, 'username logo email'); // Fetch only the username and logo fields
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/provider/:id', async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to update academy data
router.put('/academy/:id', upload.fields([{ name: 'logo' }, { name: 'crFile' }, { name: 'academyImg' }]), async (req, res) => {
  const academyId = req.params.id;

  try {
      const updatedData = {
          username: req.body.username,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          fullName: req.body.fullName,
          designation: req.body.designation,
          website: req.body.website,
          instaId: req.body.instaId,
          logo: req.files['logo'] ? req.files['logo'][0].path : undefined,
          crFile: req.files['crFile'] ? req.files['crFile'][0].path : undefined,
          licenseNo: req.body.licenseNo,
          academyImg: req.files['academyImg'] ? req.files['academyImg'][0].path : undefined,
          description: req.body.description,
          location: req.body.location,
      };

      const academy = await User.findByIdAndUpdate(academyId, updatedData, { new: true });
      if (!academy) {
          return res.status(404).json({ message: 'Academy not found.' });
      }
      res.status(200).json(academy);
  } catch (error) {
      console.error('Error updating academy:', error);
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// New route to delete academy by id
router.delete('/academy/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAcademy = await User.findByIdAndDelete(id);

    if (!deletedAcademy) {
      return res.status(404).json({ message: 'Academy not found' });
    }

    res.status(200).json({ message: 'Academy deleted successfully' });
  } catch (error) {
    console.error('Error deleting academy:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;
