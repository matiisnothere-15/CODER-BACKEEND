import logger from "../config/logger.js";
import { cartModel } from "../dao/models/carts.js";

class CartRepository {
    // Obtiene un carrito por su ID y lo popula con los productos asociados
    async getCartById(cid) {
        try {
            return await cartModel.findById(cid).populate('products.id').lean();
        } catch (error) {
            logger.error('CartRepository.getCartById => ', error);
            throw error; // Propaga el error para ser manejado por la capa superior
        }
    }

    // Crea un nuevo carrito vacío
    async createCart() {
        try {
            return await cartModel.create({}); // Crea un carrito con un array de productos vacío
        } catch (error) {
            logger.error('CartRepository.createCart => ', error);
            throw error; // Propaga el error para manejo externo
        }
    }

    // Añade un producto a un carrito existente
    async addProductToCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid); // Busca el carrito por ID
            if (!cart) return null; // Si el carrito no existe, retorna null

            // Busca si el producto ya está en el carrito
            const productInCart = cart.products.find(p => p.id.toString() === pid);
            if (productInCart) productInCart.quantity++; // Si el producto ya está, incrementa la cantidad
            else cart.products.push({ id: pid, quantity: 1 }); // Si no está, lo añade con cantidad 1

            await cart.save(); // Guarda el carrito actualizado
            return cart;
        } catch (error) {
            logger.error('CartRepository.addProductToCart => ', error);
            throw error; // Propaga el error
        }
    }

    // Elimina un producto de un carrito existente
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid); // Busca el carrito por ID
            if (!cart) return null; // Si el carrito no existe, retorna null

            // Encuentra el índice del producto en el carrito
            const productIndex = cart.products.findIndex(p => p.id.toString() === pid);
            if (productIndex === -1) return null; // Si el producto no está, retorna null

            cart.products.splice(productIndex, 1); // Elimina el producto del array de productos
            await cart.save(); // Guarda el carrito actualizado
            return cart;
        } catch (error) {
            logger.error('CartRepository.deleteProductFromCart => ', error);
            throw error; // Propaga el error
        }
    }

    // Actualiza la cantidad de un producto en el carrito
    async updateProductQuantityInCart(cid, pid, quantity) {
        try {
            // Verifica si la cantidad es válida (entero)
            if (!quantity || !Number.isInteger(quantity)) {
                throw new Error('La propiedad quantity es requerida y debe ser un número entero');
            }

            // Actualiza la cantidad del producto en el carrito
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, 'products.id': pid }, // Encuentra el carrito y producto por ID
                { $set: { 'products.$.quantity': quantity } }, // Establece la nueva cantidad
                { new: true } // Devuelve el documento actualizado
            );
            if (!cart) return null; // Si no encuentra el carrito, retorna null
            return cart; // Retorna el carrito actualizado
        } catch (error) {
            logger.error('CartRepository.updateProductQuantityInCart => ', error);
            throw error; // Propaga el error
        }
    }

    // Elimina todos los productos de un carrito (vacía el carrito)
    async deleteCart(cid) {
        try {
            const cart = await cartModel.findById(cid); // Busca el carrito por ID
            if (!cart) return null; // Si el carrito no existe, retorna null

            cart.products = []; // Vacía el array de productos
            await cart.save(); // Guarda el carrito actualizado
            return cart; // Retorna el carrito vacío
        } catch (error) {
            logger.error('CartRepository.deleteCart => ', error);
            throw error; // Propaga el error
        }
    }
}

// Exporta una instancia de CartRepository para su uso en otras partes de la aplicación
export default new CartRepository();
