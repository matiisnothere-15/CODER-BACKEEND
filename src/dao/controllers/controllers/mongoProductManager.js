import logger from "../config/logger.js";
import {
    getProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService
} from "../../services/productsManagerDBService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";




export const getProducts = async (req, res, next) => {
    try {
        const products = await getProductsService(req.query);
        res.json(products);
    } catch (error) {
        logger.error("Error al obtener productos:", error);
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            throw CustomError.createError(
                "ProductNotFoundError",
                `Producto con id ${pid} no encontrado`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({message: "Error al encontrar producto, contacte con el administrador"});
        logger.error("Error al obtener producto por ID:", error);
        // next(error);
    }
};

export const addProduct = async (req, res, next) => {
    const productData = req.body;
    productData.owner = req.user._id; // Asigna el owner al usuario actual
    try {
        const newProduct = await addProductService(productData);
        logger.debug(`Producto agregado de manera exitosa por usuario ${productData.owner}`.green)
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({message: "Error al agregar producto, contacte con el administrador"});
        logger.error("Error al agregar producto:", error);
        // next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await updateProductService(pid, updateData);
        res.json(updatedProduct);
        logger.debug(`Producto con id: ${pid} fue actualizado. Revisar el producto`.green)
    } catch (error) {
        logger.error("Error al actualizar producto:", error);
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            throw CustomError.createError(
                "ProductNotFoundError",
                `Producto con id ${pid} no encontrado`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }

        if (req.user.rol !== "admin" && product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "No autorizado para eliminar este producto" });
        }

        const deletedProduct = await deleteProductService(pid);
        logger.debug(`Producto con id: ${pid} fue eliminado de manera exitosa`.green)
        res.json({ deletedProduct });
    } catch (error) {
        logger.error("Error al eliminar producto:", error);
        next(error);
    }
};
