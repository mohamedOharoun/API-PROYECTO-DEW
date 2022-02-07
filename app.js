//Se importan todas las dependencias
require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const connectDB = require('./db/connect.js');

const authRouter = require('./routes/auth.js');
const tasksRouter = require('./routes/tasks');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');
const express = require('express');
const app = express();

app.use(express.json());//Permite transformar a json todos los request para facilitar su manipulado

app.set('trust proxy', 1);//Necesario para su subida a Heroku

app.use(rateLimiter({//Limita las peticiones de un cliente
  windows: 15 * 60 * 100,
  max: 100
}));
app.use(helmet());//Sanitiza las cabeceras y previene ciertos ataques
app.use(cors());//Necesario para acceso desde máquina no locales
app.use(xss());//Sanitiza los body para evitar que se introduzca código peligroso

app.use('/api/v1/tasks', authenticateUser, tasksRouter);
app.use('/api/v1/login', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
          console.log(`Server is listening on port ${port}...`)
        );
  } catch (error) {
    console.log(error);
  }
};

start();