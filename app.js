require('dotenv').config();
require('express-async-errors');
const cors = require('cors');

const connectDB = require('./db/connect.js');

const authRouter = require('./routes/auth.js');
const tasksRouter = require('./routes/tasks');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');
const express = require('express');
const app = express();

app.use(express.json());

app.use(cors());

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