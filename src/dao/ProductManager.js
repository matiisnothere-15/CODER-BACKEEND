const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.productos = [];
        this.init(); // Cargar datos al inicializar el ProductManager
    }

    async init() {
        try {
            const data = await fs.readFile(this.filePath, { encoding: "utf-8" });
            this.productos = JSON.parse(data);
            console.log("Productos cargados exitosamente.");
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    }

    async leerProductos() {
        return this.productos;
    }

    async guardarProductos() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.productos, null, 2));
            console.log("Productos guardados exitosamente.");
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
    }

    async obtenerProducto(id) {
        return this.productos.find(producto => producto.id === id);
    }

    async agregarProducto(producto) {
        try {
            this.productos.push(producto);
            await this.guardarProductos();
            return producto;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        const index = this.productos.findIndex(producto => producto.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...productoActualizado };
            await this.guardarProductos();
            console.log("Producto actualizado correctamente.");
        } else {
            console.error(`No se encontró ningún producto con el ID ${id}.`);
        }
    }

    async eliminarProducto(id) {
        const index = this.productos.findIndex(producto => producto.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            await this.guardarProductos();
            console.log("Producto eliminado correctamente.");
        } else {
            console.error(`No se encontró ningún producto con el ID ${id}.`);
        }
    }
}

module.exports = ProductManager;
