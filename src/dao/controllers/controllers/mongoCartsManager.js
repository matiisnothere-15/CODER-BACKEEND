import { request as req, response as res } from "express";
import {
    addProductInCartService as addProduct,
    createCartService as createCart,
    deleteCartService as removeCart,
    deleteProductsInCartService as removeProduct,
    getCartByIdService as fetchCart,
    updateProductsInCartService as updateProduct
} from "../../services/cartsServiceDB.js";
import log from "../../config/logger.js";

// Obtener carrito por ID
export const obtenerCarritoPorId = async (req = req, res = res) => {
    const { cid } = req.params;
    try {
        log.debug(`Obteniendo carrito con ID: ${cid}`);
        const carrito = await fetchCart(cid);

        if (!carrito) {
            log.warn(`Carrito con id ${cid} no encontrado`);
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        }

        return res.json({ carrito });
    } catch (error) {
        log.error(`Error al obtener carrito con ID ${cid}:`, error);
        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};

// Crear un nuevo carrito
export const crearCarrito = async (req = req, res = res) => {
    try {
        log.debug('Creando un nuevo carrito');
        const carrito = await createCart();

        return res.json({ msg: 'Carrito creado exitosamente', carrito });
    } catch (error) {
        log.error('Error al crear carrito:', error);
        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};

// Agregar producto al carrito
export const agregarProductoEnCarrito = async (req = req, res = res) => {
    const { cid, pid } = req.params;
    const usuarioId = req.user._id;

    try {
        log.debug(`Agregando producto con ID ${pid} al carrito con ID ${cid}`);
        const carrito = await addProduct(usuarioId, cid, pid);

        return res.json({ msg: 'Producto añadido al carrito correctamente', carrito });
    } catch (error) {
        log.error('Error al agregar producto al carrito:', error);

        if (error.message === "Los usuarios premium no pueden agregar sus propios productos al carrito.") {
            return res.status(400).json({ msg: error.message });
        }

        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};

// Eliminar producto del carrito
export const eliminarProductoEnCarrito = async (req = req, res = res) => {
    const { cid, pid } = req.params;

    try {
        log.debug(`Eliminando producto con ID ${pid} del carrito con ID ${cid}`);
        const carrito = await removeProduct(cid, pid);

        if (!carrito) {
            log.warn(`Carrito con id ${cid} no encontrado`);
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        }

        return res.json({ msg: `Producto con ID ${pid} eliminado del carrito`, carrito });
    } catch (error) {
        log.error('Error al eliminar producto del carrito:', error);
        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};

// Actualizar cantidad de productos en el carrito
export const actualizarProductoEnCarrito = async (req = req, res = res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        log.debug(`Actualizando producto con ID ${pid} en carrito con ID ${cid}, cantidad: ${quantity}`);
        const carrito = await updateProduct(cid, pid, quantity);

        if (!carrito) {
            log.warn(`Carrito con id ${cid} no encontrado`);
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        }

        return res.json({ carrito });
    } catch (error) {
        log.error('Error al actualizar producto en el carrito:', error);
        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};

// Eliminar carrito completo
export const eliminarCarrito = async (req = req, res = res) => {
    const { cid } = req.params;

    try {
        log.debug(`Eliminando carrito con ID ${cid}`);
        const carrito = await removeCart(cid);

        if (!carrito) {
            log.warn(`Carrito con id ${cid} no encontrado`);
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        }

        return res.json({ msg: `Carrito con ID ${cid} eliminado correctamente` });
    } catch (error) {
        log.error('Error al eliminar carrito:', error);
        return res.status(500).json({ msg: 'Error del servidor. Contacte al administrador.' });
    }
};
