const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [15, 'Title cannot exceed 15 characters']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0.01, 'Weight must be greater than 0 kg']
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        minlength: [5, 'Destination must be at least 5 characters long'],
        maxlength: [15, 'Destination cannot exceed 15 characters']
    },
    description: {
        type: String,
        maxlength: [30, 'Description cannot exceed 30 characters']
    },
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: [true, 'Driver ID is required']
    },
    isAllocated: {
        type: Boolean,
        required: [true, 'Allocation status is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    id: {
        type: String,
        unique: true
    }
});

// Create the Package model
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
