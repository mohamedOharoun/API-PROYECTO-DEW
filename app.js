require('dotenv').config();
require('express-async-errors');

const tasksRouter = require('./routes/tasks');

const express = require('express');
const app = express();

const connectDB = require('./db/connect.js');

app.use(express.json());

app.use('/api/v1/tasks', tasksRouter);

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