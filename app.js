const express = require('express');
const ProductManager = require('./ProductManager'); 
const app = express();
const port = 3000;

const productManager = new ProductManager('products.json'); 

// Route to get products with optional limit query parameter
app.get('/products', (req, res) => {
  try {
    const { limit } = req.query;
    if (limit) {
      const limitCount = parseInt(limit, 10);
      if (isNaN(limitCount)) {
        res.status(400).json({ error: 'Invalid limit parameter' });
        return;
      }

      // Get the specified number of products
      productManager.getProducts().then((products) => {
        const limitedProducts = products.slice(0, limitCount);
        res.json({ products: limitedProducts });
      });
    } else {
      // Get all products
      productManager.getProducts().then((products) => {
        res.json({ products });
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
