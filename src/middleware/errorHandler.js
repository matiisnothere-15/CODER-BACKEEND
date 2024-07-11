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
      console.error(err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
  };
  
  module.exports = errorHandler;
  