class ProductManager {
    constructor() {
        this.products = []
        this.productIdCounter = 1;
    }

    addProduct(productData) {
        if (this.products.some((product) => product.code === productData.code)) {
          throw new Error('Producto con el mismo código ya existe');
        }

        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const field of requiredFields) {
        if (!productData[field]) {
            throw new Error(`${field} is a mandatory field.`);
        }
        }

        const newProduct = {
            id: this.productIdCounter++,
            ...productData,
        };
    
        this.products.push(newProduct);
    }

    getProducts() {
        console.log(this.products)
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
          console.log('Not found');
        }
        return product;
      }
}

//Prueba:
const productManager = new ProductManager();

productManager.addProduct({
    title: 'Product 1',
    description: 'Description 1',
    price: 10.99,
    thumbnail: 'product1.jpg',
    code: 'P001',
    stock: 100,
  });

productManager.addProduct({
    title: 'Product 2',
    description: 'Description 2',
    price: 19.99,
    thumbnail: 'product2.jpg',
    code: 'P002',
    stock: 50,
});

productManager.getProducts()

//id no existente
//productManager.getProductById(3); 

//Falta campo stock
    // productManager.addProduct({
    // title: 'Product 3', //Faltan campos
    // description: 'Description 3',
    // price: 7.99,
    // thumbnail: 'product3.jpg',
    // code: 'P003', //Campo code repetido
// });

//Campo code repetido:
// productManager.addProduct({
    // title: 'Product 4',
    // description: 'Description 4',
    // price: 5.99,
    // thumbnail: 'product5.jpg',
    // code: 'P002', 
    // stock: 50
// });
    