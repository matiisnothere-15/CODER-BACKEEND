import fs from "fs";
import path from "path";

class ProductManager {
    constructor(dirPath) {
        this.products = [];
        this.path = path.join(dirPath, "src", "db", "products.json");
        this.idPath = path.join(dirPath, "src", "db", "idProducts.txt");
    }

    async addProduct(obj) {
        try {            
            await this.getIdProducts();
            const id = ++this.idProducts;
            await fs.promises.writeFile(this.idPath, id.toString());
            const nuevoProducto = { id, ...obj };
            this.products.push(nuevoProducto);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4));
            return this.products;
        } catch (error) {
            throw new Error("Error al agregar producto");
        }
    }

    async getProducts() {
        try {
            let resultado = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            let productosParseados = JSON.parse(resultado);
            if (!Array.isArray(productosParseados)) {
                throw new Error("Error, la DB no tiene un formato de array válido");
            }
            this.products = [...productosParseados];
            return productosParseados;
        } catch (error) {
            throw new Error("Error al obtener los productos");
        }
    }

    async getProductById(id) {
        try {
            const producto = this.products.find(elem => elem.id === id);
            return producto || "No hay productos con el id solicitado";
        } catch (error) {
            throw new Error("Error al obtener el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const productoIndex = this.products.findIndex(elem => elem.id === id);
            if (productoIndex === -1) {
                return "El id del producto que desea eliminar no existe";
            }
            const productoEliminado = this.products.splice(productoIndex, 1)[0];
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4));
            return productoEliminado;
        } catch (error) {
            throw new Error("Error al eliminar el producto");
        }
    }

    async updateProduct(id, obj) {
        try {
            const productoIndex = this.products.findIndex(elem => elem.id === id);
            if (productoIndex === -1) {
                return "El ID del producto a editar no existe";
            }
            const producto = { id, ...obj };
            this.products[productoIndex] = producto;
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 4));
            return producto;
        } catch (error) {
            throw new Error("Error al editar el producto");
        }
    }

    async getIdProducts() {
        try {
            const ultimoId = await fs.promises.readFile(this.idPath, { encoding: "utf-8" });
            this.idProducts = parseInt(ultimoId);
        } catch (error) {
            throw new Error("Error al obtener el último ID de la DB");
        }
    }
}

export default ProductManager;
