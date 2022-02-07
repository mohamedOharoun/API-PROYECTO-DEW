const Task = require('../models/task.js');
const {StatusCodes} = require('http-status-codes');

//Conseguir todos las notas del usuario 
const getAllTasks = async(req, res) => {
    const tasks = await Task.find({user: req.user.userId}).sort('createdAt');//Se ordenarán situando los más viejos primero

    res.status(StatusCodes.OK).json({count: tasks.length, tasks});
}

//Crear nota
const createTask = async (req, res) => {
    req.body.user = req.user.userId;//Añadir la id de usuario al conjunto de datos recibidos

    const task = await Task.create(req.body);

    res.status(StatusCodes.CREATED).json({task});
};

//Actualizar nota
const updateTask = async(req, res) => {
    //Se obtienen las variables del request
    const {
        body: {name, content},
        user: {userId},
        params: {id: taskId}
    } = req;

    //Se comprueba que la nota tiene un nombre y contenido
    if(name === '' || content === ''){
        throw new BadRequestError('Name or Content fields cannot be empty');
    }

    //Se actualiza según la id de la nota y del usuario
    const task = await Task.findByIdAndUpdate(
        {
            _id: taskId,
            user: userId
        },
        req.body,
        {
            new: true,
            runValidators: true//Se comprueba que cumpla los requisitos del modelo
        }
    );

    if(!task){//En caso de que no exista una nota con tal id
        throw new NotFoundError(`No Task with ${taskId}`);
    }

    res.status(StatusCodes.OK).json({task});
}

//Borado de la nota según la id de la nota y el usuario.
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