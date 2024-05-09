import ProductManager from "./ProductManagerMONGO.js";
import { cartModelo } from './models/cartModelo.js';
import mongoose from "mongoose";

export default class CartManager {

    async getCarts() {
        try {
            return await cartModelo.find().populate("products.product").lean();
        } catch (error) {
            throw new Error(`Error al obtener carritos: ${error}`);
        }
    };

    async createCart() {
        try {
            let cart = await cartModelo.create({ products: [] });
            return cart.toJSON();
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error}`);
        }
    };

    async getCartsBy(filtro = {}) {
        try {
            return await cartModelo.findOne(filtro).populate("products.product").lean();
        } catch (error) {
            throw new Error(`Error al obtener carrito por filtro: ${error}`);
        }
    };

    async getCartsProducts(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            return cart.products;
        } catch (error) {
            throw new Error(`Error al obtener productos del carrito: ${error}`);
        }
    };

    async addProductToCart(cid, pid) {
        try {
            const cart = await cartModelo.findById(cid);

            if (!cart) {
                return `Carrito con id ${cid} no encontrado`;
            }

            const existingProduct = cart.products.find(product => product.product.equals(pid));

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                const productManager = new ProductManager();
                const product = await productManager.getProductsBy({ _id: pid });

                if (!product || product === "Not found") {
                    console.log(`Producto con id ${pid} no encontrado`);
                    return `Producto con id ${pid} no encontrado`;
                }

                cart.products.push({ product: pid, quantity: 1 });
                console.log(`Nuevo producto agregado al carrito: ${product}`);
            }

            await cart.save();
            console.log(`Carrito actualizado correctamente: ${cart}`);

            return cart;
        } catch (error) {
            throw new Error(`Error al añadir producto: ${error}`);
        }
    };

    async updateCart(cid, products) {
        try {
            let cart = await cartModelo.findByIdAndUpdate(
                cid,
                { $set: { products: products } },
                { returnDocument: "after" }
            )
            return `Carrito ${JSON.stringify(cart, null, 5)}`
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error}`);
        }
    }

    async updateProductQ(cid, pid, quantity) {
        try {
            let cart = await cartModelo.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            ).populate("products.product");
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto: ${error}`);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            const cart = await cartModelo.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { returnDocument: "after" }
            );

            if (!cart) {
                return `Carrito con id ${cid} no encontrado`;
            }

            cart.products = [];

            await cart.save();
            console.log(`Productos eliminados correctamente: ${cart}`);

            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar los productos del carrito: ${error}`);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartModelo.findByIdAndUpdate(
                cid,
                { $inc: { 'products.$[product].quantity': -1 } },
                { new: true, arrayFilters: [{ 'product._id': pid }] }
            );

            if (!cart) {
                return `Carrito con id ${cid} no encontrado`;
            }

            console.log(`Producto eliminado del carrito: ${cart}`);

            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error}`);
        }
    }
};