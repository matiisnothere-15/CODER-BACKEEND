const errorDictionary = {
    PRODUCT_NOT_FOUND: {
      status: 404,
      message: 'Product not found',
    },
    CART_NOT_FOUND: {
      status: 404,
      message: 'Cart not found',
    },
    INVALID_PRODUCT_DATA: {
      status: 400,
      message: 'Invalid product data',
    },
    // Add more error types as needed
  };
  
  const errorHandler = (err, req, res, next) => {
    const error = errorDictionary[err.message] || {
      status: 500,
      message: 'Internal Server Error',
    };
    res.status(error.status).json({ error: error.message });
  };
  
  module.exports = errorHandler;
  