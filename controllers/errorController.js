const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value "${err.keyValue.name}" please use another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  console.log(req.originalUrl);
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!,',
    msg: err.message,
  });
};

const handleValidationErrorDB = (err, res) => {
  const message = `Invalid input data ${err.message}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in agian', 401);

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 1) Log error
    console.error('ERROR', err);
    // 2) Send generic message
    // B) programming or other uknown error: don't leak error details
    return res.status(err.statusCode).json({
      status: 'Something went wrong!,',
      message: 'Please try again later',
    });
  }
  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // 1) Log error
  console.error('ERROR', err);
  // 2) Send generic message
  // B) programming or other uknown error: don't leak error details
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let type = err[Object.keys(err)[0]];
    type = type[Object.keys(type)[0]];
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (type && type.name === 'ValidatorError')
      error = handleValidationErrorDB(type);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();
    else if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
