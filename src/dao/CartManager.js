const fs = require("fs").promises;
const path = require("path");

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async leerCarrito() {
        try {
            const data = await fs.readFile(this.filePath, { encoding: "utf-8" });
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo del carrito:", error);
            throw error;
        }
    }

    async guardarCarrito(carrito) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(carrito, null, 2));
            console.log("Carrito guardado exitosamente.");
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cid, producto) {
        try {
            const carrito = await this.leerCarrito();
            const indice = carrito.findIndex(cart => cart.id === cid);
            if (indice !== -1) {
                // Verificar si el producto ya está en el carrito
                const existingProduct = carrito[indice].products.find(p => p.id === producto.id);
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    carrito[indice].products.push({ id: producto.id, quantity: 1 });
                }
                await this.guardarCarrito(carrito);
                console.log("Producto agregado al carrito.");
            } else {
                console.log(`No se encontró ningún carrito con el ID ${cid}.`);
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }
    async actualizarProductoEnCarrito(cid, pid, cantidad) {
        try {
            const carrito = await this.leerCarrito();
            const indice = carrito.findIndex(cart => cart.id === cid);
            if (indice !== -1) {
                const productoIndex = carrito[indice].products.findIndex(p => p.id === pid);
                if (productoIndex !== -1) {
                    carrito[indice].products[productoIndex].quantity = cantidad;
                    await this.guardarCarrito(carrito);
                    console.log("Producto actualizado en el carrito correctamente.");
                } else {
                    console.error(`No se encontró ningún producto con el ID ${pid} en el carrito.`);
                }
            } else {
                console.error(`No se encontró ningún carrito con el ID ${cid}.`);
            }
        } catch (error) {
            console.error("Error al actualizar producto en el carrito:", error);
            throw error;
        }
    }
    
    async eliminarProductoDelCarrito(cid, pid) {
        try {
            const carrito = await this.leerCarrito();
            const indice = carrito.findIndex(cart => cart.id === cid);
            if (indice !== -1) {
                const productoIndex = carrito[indice].products.findIndex(p => p.id === pid);
                if (productoIndex !== -1) {
                    carrito[indice].products.splice(productoIndex, 1);
                    await this.guardarCarrito(carrito);
                    console.log("Producto eliminado del carrito correctamente.");
                } else {
                    console.error(`No se encontró ningún producto con el ID ${pid} en el carrito.`);
                }
            } else {
                console.error(`No se encontró ningún carrito con el ID ${cid}.`);
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw error;
        }
    }
    
}

module.exports = CartManager;
