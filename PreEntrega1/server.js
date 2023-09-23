const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

let productsData = [];
let cartsData = [];

const loadInitialData = () => {
  try {
    productsData = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  } catch (err) {
    productsData = [];
  }

  try {
    cartsData = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));
  } catch (err) {
    cartsData = [];
  }
};

loadInitialData();

app.use((req, res, next) => {
  fs.writeFileSync('productos.json', JSON.stringify(productsData, null, 2));
  fs.writeFileSync('carrito.json', JSON.stringify(cartsData, null, 2));
  next();
});

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const { limit } = req.query;
  let products = productsData;

  if (limit) {
    products = products.slice(0, parseInt(limit, 10));
  }

  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = productsData.find((p) => p.id === pid);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const newProduct = {
    id: generateProductId(),
    ...req.body,
  };

  productsData.push(newProduct);
  res.status(201).json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProductIndex = productsData.findIndex((p) => p.id === pid);

  if (updatedProductIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { id, ...updatedFields } = req.body;
  productsData[updatedProductIndex] = { ...productsData[updatedProductIndex], ...updatedFields };

  res.json(productsData[updatedProductIndex]);
});

productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const deletedProductIndex = productsData.findIndex((p) => p.id === pid);

  if (deletedProductIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = productsData.splice(deletedProductIndex, 1);
  res.json(deletedProduct[0]);
});

app.use('/api/products', productsRouter);

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateCartId(),
    products: [],
  };

  cartsData.push(newCart);
  res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = cartsData.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const cart = cartsData.find((c) => c.id === cid);
  const product = productsData.find((p) => p.id === pid);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingProduct = cart.products.find((item) => item.product === pid);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  res.json(cart.products);
});

app.use('/api/carts', cartsRouter);

function generateProductId() {
  return 'P' + Math.random().toString(36).substr(2, 9);
}

function generateCartId() {
  return 'C' + Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
