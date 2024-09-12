const express = require('express');
const multer = require('multer');

const router = express.Router();
const Course = require('../models/Course');

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Add a new course
router.post('/addcourse', upload.array('academyImg', 10), async (req, res) => {
  try {
    const {
      providerId,
      name,
      duration,
      durationUnit,
      startDate,
      endDate,
      description,
      feeAmount,
      feeType,
      days,
      timeSlots,
      location,
      ageGroup,
      courseType,
      promoted,
    } = req.body;

    // Ensure the timeSlots are parsed correctly
    const parsedTimeSlots = typeof timeSlots === 'string' ? JSON.parse(timeSlots) : timeSlots;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedAge = typeof ageGroup === 'string' ? JSON.parse(ageGroup) : ageGroup;

    // Handle the images
    const images = req.files ? req.files.map((file) => file.buffer.toString('base64')) : [];

    const newCourse = new Course({
      providerId,
      name,
      duration,
      durationUnit,
      startDate,
      endDate,
      description,
      feeAmount,
      feeType,
      days,
      timeSlots: parsedTimeSlots,
      location: parsedLocation,
      ageGroup: parsedAge,
      courseType,
      images,  // Base64 encoded images
      promoted,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
});




// Route to search for a course by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    // Find course by name (case-insensitive search)
    const course = await Course.findOne({ name: { $regex: new RegExp(name, 'i') } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a course
router.put('/update/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a course
router.delete('/delete/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to get courses by provider IDs
router.get('/by-providers', async (req, res) => {
  const { providerIds } = req.query;

  try {
    const courses = await Course.find({ providerId: { $in: providerIds } });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/course/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
