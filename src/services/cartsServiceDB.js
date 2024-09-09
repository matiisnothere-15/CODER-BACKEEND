import logger from "../config/logger.js";
import CartRepository from "../repository/cartRepository.js";
import productsRepository from "../repository/ProductsRepository.js";

// Servicio para obtener un carrito por su ID
export const getCartByIdService = async (cid) => {
    try {
        // Llama al repositorio para obtener el carrito por su ID
        return await CartRepository.getCartById(cid);
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("getCartByIdService => ", error);
        throw error;
    }
};

// Servicio para crear un nuevo carrito
export const createCartService = async () => {
    try {
        // Llama al repositorio para crear un nuevo carrito
        return await CartRepository.createCart();
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("createCartService => ", error);
        throw error;
    }
};

// Servicio para añadir un producto al carrito
export const addProductInCartService = async (userId, cid, pid) => {
    try {
        // Obtiene el producto por su ID
        const product = await productsRepository.getProductById(pid);

        // Valida si el usuario es dueño del producto (usuarios premium no pueden agregar sus propios productos)
        if (product.owner.toString() === userId.toString()) {
            throw new Error("Los usuarios premium no pueden agregar sus propios productos al carrito.");
        }

        // Llama al repositorio para añadir el producto al carrito
        return await CartRepository.addProductToCart(cid, pid);
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("addProductInCartService => ", error);
        throw error;
    }
};

// Servicio para eliminar un producto del carrito
export const deleteProductsInCartService = async (cid, pid) => {
    try {
        // Llama al repositorio para eliminar el producto del carrito
        return await CartRepository.deleteProductFromCart(cid, pid);
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("deleteProductsInCartService => ", error);
        throw error;
    }
};

// Servicio para actualizar la cantidad de un producto en el carrito
export const updateProductsInCartService = async (cid, pid, quantity) => {
    try {
        // Llama al repositorio para actualizar la cantidad de productos en el carrito
        return await CartRepository.updateProductQuantityInCart(cid, pid, quantity);
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("updateProductsInCartService => ", error);
        throw error;
    }
};

// Servicio para eliminar un carrito por su ID
export const deleteCartService = async (cid) => {
    try {
        // Llama al repositorio para eliminar el carrito completo
        return await CartRepository.deleteCart(cid);
    } catch (error) {
        // Registra el error en el logger y lo propaga
        logger.error("deleteCartService => ", error);
        throw error;
    }
};
