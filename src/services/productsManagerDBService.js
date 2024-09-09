import ProductRepository from "../repository/ProductsRepository"

// Servicio para obtener productos con parámetros opcionales (paginación, filtros, etc.)
export const getProductsService = async (params) => {
    try {
        // Llama al repositorio de productos para obtener una lista de productos
        return await ProductRepository.getProducts(params);
    } catch (error) {
        // Manejo de errores: registra el error y lo propaga
        console.log("getProductsService => ", error);
        throw error;
    }
};

// Servicio para obtener un producto específico por su ID
export const getProductByIdService = async (pid) => {
    try {
        // Llama al repositorio para obtener un producto por su ID
        return await ProductRepository.getProductById(pid);
    } catch (error) {
        // Manejo de errores: registra el error y lo propaga
        console.log("getProductByIdService => ", error);
        throw error;
    }
};

// Servicio para añadir un nuevo producto
export const addProductService = async (productData) => {
    try {
        // Llama al repositorio para agregar un nuevo producto con los datos proporcionados
        return await ProductRepository.addProduct(productData);
    } catch (error) {
        // Manejo de errores: registra el error y lo propaga
        console.log("addProductService => ", error);
        throw error;
    }
};

// Servicio para actualizar un producto existente
export const updateProductService = async (pid, updateData) => {
    try {
        // Llama al repositorio para actualizar un producto por su ID y los nuevos datos
        return await ProductRepository.updateProduct(pid, updateData);
    } catch (error) {
        // Manejo de errores: registra el error y lo propaga
        console.log("updateProductService => ", error);
        throw error;
    }
};

// Servicio para eliminar un producto por su ID
export const deleteProductService = async (pid) => {
    try {
        // Llama al repositorio para eliminar un producto por su ID
        return await ProductRepository.deleteProduct(pid);
    } catch (error) {
        // Manejo de errores: registra el error y lo propaga
        console.log("deleteProductService => ", error);
        throw error;
    }
};
