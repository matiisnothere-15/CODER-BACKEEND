import fs from 'fs';
import path from 'path';
const productsFilePath = path.join(process.cwd(), 'data/productos.json');

class ProductManagerFS {
  async getAll() {
    const data = await fs.promises.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find(product => product.id === id);
  }

  async create(productData) {
    const products = await this.getAll();
    const newProduct = { id: products.length + 1, ...productData };
    products.push(newProduct);
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async update(id, productData) {
    const products = await this.getAll();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return null;
    }
    products[index] = { id, ...productData };
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async delete(id) {
    let products = await this.getAll();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      return null;
    }
    const deletedProduct = products.splice(index, 1);
    await fs.promises.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return deletedProduct[0];
  }
}

export default ProductManagerFS;
