const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [20, 'Name cannot exceed 20 characters']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: {
            values: ['food', 'furniture', 'electronic'],
            message: 'Department must be one of: food, furniture, electronic'
        }
    },
    licenceNumber: {
        type: String,
        required: [true, 'Licence number is required'],
        minlength: [5, 'Licence number must be 5 characters long'],
        maxlength: [5, 'Licence number must be 5 characters long']
    },
    isActive: {
        type: Boolean,
        required: [true, 'Status is required'],
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: [true, 'ID must be unique']
    },
    assigned_packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }]
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
