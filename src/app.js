import express from "express";
import { productsManager } from "./ProductsManager.js";
const app = express();

// get all products
app.get("/api/products", async (req, res) => {
  const {limit} = req.query
  const products = await productsManager.getProducts();
  try {
    if (limit) {
      const limitCount = parseInt(limit);
      if (isNaN(limitCount)) {
        res.status(400).json({ error: 'Invalid limit parameter' });
        return;
      }
      if(limit <= products.length){
        const limitedProducts = products.slice(0, limitCount);
        return res.status(200).json({ message: "Limited number of products", limitedProducts });
      } else {
        return res.status(400).json({ error: 'Limit larger than products available' });
      }
    }
    if (!products.length) {
      return res.status(200).json({ message: "No products" });
    }
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/products/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const product = await productsManager.getProductById(idProduct);
    if (!product) {
      return res.status(400).json({ message: "Product not found with the id" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});