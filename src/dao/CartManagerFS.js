import fs from 'fs';
import productManager from "./ProductManagerFS.js";
import { dirname } from "../utils.js";
import path from "path";

const rutaProducto = path.join(dirname, './data/productos.json');

export default class CartManager {
    constructor(rutaCart) {
        this.path = rutaCart;
        this.init();
    }

    async init() {
        try {
            const carts = await this.getCarts();
            if (carts.length > 0) {
                const maxId = Math.max(...carts.map(cart => cart.id));
                CartManager.idcart = maxId + 1;
            }
            return CartManager.idcart;
        } catch (error) {
            console.error('Error al inicializar:', error);
        }
    }

    async addCart() {
        try {
            let id = await this.init();
            const carts = await this.getCarts();
            const newCarrito = {
                id: id,
                products: []
            };
            carts.push(newCarrito);
            await this.saveCart(carts);
            return `El carrito se ha añadido correctamente ${newCarrito}`;
        } catch (error) {
            console.error('Error al añadir carrito:', error);
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
                const carts = JSON.parse(data);
                if (Array.isArray(carts)) {
                    return carts;
                } else {
                    console.log("El contenido del archivo JSON no es un array válido.");
                    return [];
                }
            } else {
                console.log(`El archivo JSON no existe en la ruta: ${this.path}. Creando un nuevo archivo...`);
                await this.saveCart([]);
                return [];
            }
        } catch (error) {
            throw new Error('Error al obtener carritos:', error);
        }
    }

    async saveCart(data) {
        try {
            const jsonData = JSON.stringify(data, null, 4);
            await fs.promises.writeFile(this.path, jsonData, 'utf8');
            console.log('Archivo guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    async getCartsById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
        }
    }

    async getCartsProducts(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            return cart.products;
        } catch (error) {
            console.error('Error al obtener productos del carrito por ID:', error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const index = carts.findIndex(cart => cart.id === cid);

            if (index !== -1) {
                const cart = carts[index];
                const existingProductIndex = cart.products.findIndex(product => product.id === pid);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity++;
                } else {
                    const p = new productManager(rutaProducto);
                    await p.getProducts();
                    const product = await p.getProductsById(pid);

                    if (!product || product === "Not found") {
                        return `Producto con id ${pid} no encontrado`;
                    }

                    cart.products.push({ id: pid, quantity: 1 });
                }

                carts[index] = cart;
                await this.saveCart(carts);
                return cart;
            } else {
                return `Carrito con id ${cid} no encontrado`;
            }
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
        }
    }
}