const Task = require('../models/task.js');
const {StatusCodes} = require('http-status-codes');

const getAllTasks = async(req, res) => {
    const tasks = await Task.find({user: req.user.userId}).sort('createdAt');

    res.status(StatusCodes.OK).json({count: tasks.length, tasks});
}

const createTask = async (req, res) => {
    req.body.user = req.user.userId;

    const task = await Task.create(req.body);

    res.status(StatusCodes.CREATED).json({task});
};

const updateTask = async(req, res) => {
    const {
        body: {name, content, completed, user},
        user: {userId},
        params: {id: taskId}
    } = req;

    if(name === '' || content === ''){
        throw new BadRequestError('Name or Content fields cannot be empty');
    }

    const task = await Task.findByIdAndUpdate(
        {
            _id: taskId,
            user: userId
        },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if(!task){
        throw new NotFoundError(`No Task with ${taskId}`);
    }

    res.status(StatusCodes.OK).json({task});
}

const deleteTask = async(req, res) => {
    const {
        user: {userId},
        params: {id: taskId}
    } = req;

    const task = await Task.findOneAndRemove(
        {
            _id: taskId,
            user: userId
        }
    );

    if(!task){
        throw new NotFoundError(`No Task with ${taskId}`);
    }

    res.status(StatusCodes.OK).json();
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
}