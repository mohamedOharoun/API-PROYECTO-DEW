const mongoose = require('mongoose');

//Modelado de las notas
const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide a name'],
        trim: true,
        maxLength: [20, 'Name can not be more than 20 characters'],
        minlength: [3, 'Name can not be less than 3 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content for your task'],
        trim: true,
        maxLength: [240, 'Content must be max 240 characters long']
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'An user must be related to the task']
    } 
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema);