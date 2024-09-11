const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, enum: ['days', 'weeks', 'months', 'years'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    feeAmount: { type: Number, required: true },
    feeType: { type: String, enum: ['full_course', 'per_day', 'per_week', 'per_month'], required: true },
    days: { type: [String], required: true },
    timeSlots: { type: [timeSlotSchema], required: true },
    location: { type: [String], required: true },
    courseType: { type: String, required: true }, // Added courseType field
    images: [{ type: String, required: true }], // Store the images as an array of Base64 encoded strings
    // hashtags: { type: [String], required: true },
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
