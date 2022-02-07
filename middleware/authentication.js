const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors/index.js');

//Middleware que comprobará las credenciales en cada petición de la API
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;//Se obtiene el token de la cabecera

    if(!authHeader || !authHeader.startsWith('Bearer ')){//Se comprueba el token y que viene en el formato correcto
        throw new UnauthenticatedError('Authentication error');
    }

    const token = authHeader.split(' ')[1];

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);//Se verfica que la contraseña es correcta
        req.user = {userId: payload.userId, name: payload.name};//Se añade al objeto de request las credenciales para los controladores
        next();
    }catch(err){
        throw new UnauthenticatedError('Authentication error');
    }
}

module.exports = auth;