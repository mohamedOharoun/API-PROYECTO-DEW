const User = require('../models/user.js');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors/index.js');
const bcrypt = require('bcryptjs');

//Registra a un nuevi usuario
const register = async(req, res) => {
    const user = await User.create({...req.body});

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token});//Se mandará el nombre de usuario y un token para la gestión de login
}

//Logea a los usuarios que entren
const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){//Se deberá proveer de un correo y contraseña
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    if(!user){//En caso de que no se encuentre el usuario se dará un error
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){//La contraseña deberá ser la del usuario
        throw new UnauthenticatedError('Wrong Credentials');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user:{name: user.name}, token});
}

module.exports = {
    register,
    login
}