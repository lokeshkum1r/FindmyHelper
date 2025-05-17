const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(err.errors).map(val => val.message) 
      });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate field value' });
    }
  
    res.status(500).json({ message: 'Server error' });
  };
  
  module.exports = errorHandler;