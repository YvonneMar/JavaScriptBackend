const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(productData) {
    try {
      const products = await this.readProductsFromFile();
      const newProduct = {
        id: this.generateProductId(products),
        ...productData,
      };
      products.push(newProduct);
      await this.writeProductsToFile(products);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await this.readProductsFromFile();
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProductsFromFile();
      const product = products.find((product) => product.id === id);
      if (!product) {
        return null; // Product not found
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.readProductsFromFile();
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return null; // Product not found
      }
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;
      await this.writeProductsToFile(products);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.readProductsFromFile();
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return false; // Product not found
      }
      products.splice(productIndex, 1); // Remove the product at the found index
      await this.writeProductsToFile(products);
      return true; // Product deleted successfully
    } catch (error) {
      throw error;
    }
  }

  async readProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File does not exist, return an empty array
        return [];
      }
      throw error;
    }
  }

  async writeProductsToFile(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw error;
    }
  }

  generateProductId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}