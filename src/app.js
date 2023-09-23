const express = require('express');
const ProductManager = require('./src/ProductManager');
const app = express();
const port = 3000;

const productManager = new ProductManager('./src/products.json');

app.use(express.json());

app.get('/products', (req, res) => {
  try {
    const { limit } = req.query;
    if (limit) {
      const limitCount = parseInt(limit, 10);
      if (isNaN(limitCount)) {
        res.status(400).json({ error: 'Invalid limit parameter' });
        return;
      }

      productManager.getProducts().then((products) => {
        const limitedProducts = products.slice(0, limitCount);
        res.json({ products: limitedProducts });
      });
    } else {
      productManager.getProducts().then((products) => {
        res.json({ products });
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  productManager.getProductById(productId)
    .then((product) => {
      if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
