import fs from "fs";
import path from "path";

class CartManager {
    constructor(dirPath) {
        this.carts = [];
        this.path = path.join(dirPath, "src", "db", "carts.json");
        this.idPath = path.join(dirPath, "src", "db", "idCarts.txt");
        this.idCarts = 0;
    }

    async getIdCart() {
        try {
            const ultimoId = await fs.promises.readFile(this.idPath, { encoding: "utf-8" });
            this.idCarts = parseInt(ultimoId);
        } catch (error) {
            throw new Error("Error al obtener el último ID de la DB");
        }
    }

    async getCarts() {
        try {
            let carts = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            let parsedCarts = JSON.parse(carts);
            if (!Array.isArray(parsedCarts)) {
                throw new Error("Error, la DB no tiene un formato de array válido");
            }
            this.carts = [...parsedCarts];
            return parsedCarts;
        } catch (error) {
            throw new Error("Error al obtener los carritos");
        }
    }

    async createCart() {
        try {
            await this.getIdCart();
            this.idCarts += 1;
            const nuevoCarrito = { id: this.idCarts, products: [] };
            this.carts.push(nuevoCarrito);
            await fs.promises.writeFile(this.idPath, this.idCarts.toString());
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 4));
            return nuevoCarrito;
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(id) {
        try {
            const carrito = this.carts.find(elem => elem.id === id);
            return carrito || "No existe carrito con el ID proporcionado";
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    async addToCart(carrito, pid) {
        try {
            const productoIndex = carrito.products.findIndex(elem => elem.producto === pid);
            if (productoIndex !== -1) {
                carrito.products[productoIndex].quantity += 1;
            } else {
                carrito.products.push({ producto: pid, quantity: 1 });
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 4));
            return carrito;
        } catch (error) {
            throw new Error("Error al agregar producto al carrito");
        }
    }
}

export default CartManager;
