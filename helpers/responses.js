const success = (res, statusCode, data) => {
    res.status(statusCode).json({
      success: true,
      data,
    });
  };
  
  const error = (res, statusCode, message) => {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  module.exports = {
    success,
    error,
  };