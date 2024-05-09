import fs from 'fs';

export default class ProductManager {

    constructor(rutaProducto) {
        this.path = rutaProducto;
        console.log(rutaProducto);
    }

    async init() {
        try {
            const products = await this.getProducts();
            if (products.length > 0) {
                const maxId = Math.max(...products.map(product => product.id));
                ProductManager.idProducto = maxId + 1;
            } else {
                ProductManager.idProducto = 1;
            }
            return ProductManager.idProducto;
        } catch (error) {
            throw new Error(`Error al inicializar: ${error}`);
        }
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                return JSON.parse(data);
            } else {
                console.log(`El archivo JSON no existe en la ruta: ${this.path}. Creando un nuevo archivo...`);
                await this.saveProduct([]); // Llamar a saveProduct con un array vacío
                return []; // Devolver un array vacío
            }
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error}`);
        }
    }

    async saveProduct(data) {
        try {
            const jsonData = JSON.stringify(data, null, 4);
            await fs.promises.writeFile(this.path, jsonData, 'utf8');
            console.log('Archivo guardado correctamente');
        } catch (error) {
            throw new Error(`Error al guardar el producto: ${error}`);
        }
    }

    async addProduct(product) {
        try {
            let products = await this.getProducts();
            let id = await this.init();

            product = {
                id: id,
                status: true,
                ...product
            };

            products.push(product);
            await this.saveProduct(products);
            return `El producto se ha añadido correctamente ${product}`;
        } catch (error) {
            throw new Error(`Error al añadir producto: ${error}`);
        }
    }

    async getProductsById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error}`);
        }
    }

    async updateProduct(id, updateData) {
        try {
            const products = await this.getProducts();
            const productId = Number(id);
            const index = products.findIndex(p => p.id === productId);

            if (index >= 0) {
                const allowedParams = ['title', 'description', 'price', 'thumbnail', 'stock', 'category'];
                const updateKeys = Object.keys(updateData);

                if (updateKeys.some(key => !allowedParams.includes(key))) {
                    console.log(`Error: Los parámetros añadidos no son válidos para la actualización. Solo se admitirán ${allowedParams}`);
                    return 'Error: Parámetros no válidos';
                }

                products[index] = { ...products[index], ...updateData };

                updateKeys.forEach(key => {
                    if (allowedParams.includes(key)) {
                        products[index][key] = updateData[key];
                    }
                });

                await this.saveProduct(products);
                console.log(`El producto con la ID: ${productId} ha sido actualizado`);
                return `El producto ${productId} se ha modificado correctamente`;
            } else {
                console.log(`El producto con el id ${id} no existe`);
                return 'Error: Producto no encontrado';
            }
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error}`);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const productId = Number(id);
            const updatedProducts = products.filter(product => product.id !== productId);

            if (updatedProducts.length !== products.length) {
                await this.saveProduct(updatedProducts); // Guardar la lista actualizada de productos
                console.log(`El producto con la ID: ${productId} ha sido eliminado`);
                return `El producto con la ID: ${productId} ha sido eliminado`;
            } else {
                console.log(`El producto con el id ${productId} no existe`);
                return 'Error: Producto no encontrado';
            }
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error}`);
        }
    }
}