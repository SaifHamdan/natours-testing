// this handler is for errors that has nothing to do with async functions
// for example trying to log variable doesn't exist in our app
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv is a tool to take all data from .env files and save it in process.env
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// connect our project to mongoDB using mongoose library
// connect our project to mongoDB using mongoose library
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!')); // this method return a promise

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}... `);
});

// global error handler for every error we didn't handle or forgot to
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  // it's better practice to close the server first then shut down the process
  server.close(() => {
    process.exit(1);
  });
});

// this is for heroku when it shuts the server every 24h
// we don't want to shut it down immeditly it should handle the requests then shut down
process.on('SIGTERM', () => {
  console.log('TIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated!');
  });
});
