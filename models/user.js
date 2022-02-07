const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//Modelado de los usuarios
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required to be provided'],
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        required: [true, 'Name is required to be provided'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'The email must be valid'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required to be provided'],
        minLength: 3
    },
});

//Se encriptará la contraseña del usuario antes de guardarse en la base de datos
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Creará un token JWT para cada usuario que se introduzca
UserSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id, 
        name:this.name}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

//Función para comprobar las credenciales del usuario en cada operación
UserSchema.methods.comparePassword = async function(password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);