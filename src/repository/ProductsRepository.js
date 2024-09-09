import { productModel } from "../dao/models/products.js";

class ProductRepository {
    // Obtiene productos con opciones de paginación, filtros y ordenación
    async getProducts({ limit = 10, page = 1, sort, query = {} }) {
        // Asegura que la página no sea 0 y convierte los valores a números
        page = page == 0 ? 1 : page;
        page = Number(page);
        limit = Number(limit);

        // Calcula cuántos documentos saltar para la paginación
        const skip = (page - 1) * limit;
        
        // Define el orden de la ordenación: ascendente o descendente
        const sortOrder = { 'asc': -1, 'desc': 1 };
        sort = sortOrder[sort] || null;

        // Intenta analizar el query si se pasa como string en formato JSON
        if (typeof query === 'string') {
            try {
                query = JSON.parse(decodeURIComponent(query)); // Decodifica y parsea la query
            } catch (err) {
                console.error('Error al analizar la query', err);
                throw new Error('Formato incorrecto de query'); // Lanza error si falla el análisis de la query
            }
        }

        // Realiza la consulta a la base de datos con los parámetros dados
        const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();

        // Aplica la ordenación si es necesario
        if (sort !== null) {
            queryProducts.sort({ price: sort });
        }

        // Ejecuta las consultas de productos y el conteo de documentos en paralelo
        const [products, totalDocs] = await Promise.all([
            queryProducts,
            productModel.countDocuments(query)
        ]);

        // Calcula las páginas totales, y si hay páginas previas o siguientes
        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        // Retorna los resultados junto con la información de paginación
        return {
            totalDocs,
            totalPages,
            page,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            limit,
            query: JSON.stringify(query), // Retorna la query en formato string para mantener consistencia
            payload: products, // Los productos obtenidos
            prevLink: '', // Enlace de página previa, se puede agregar si se usa en frontend
            nextLink: '', // Enlace de página siguiente, se puede agregar si se usa en frontend
        };
    }

    // Ejemplo de uso con filtros: 
    // http://localhost:3000/api/products?query={"category":"Camisetas"}&limit=10&page=1&sort=asc

    // Obtiene un producto por su ID
    async getProductById(pid) {
        try {
            return await productModel.findById(pid).lean(); // Usa lean para obtener un objeto plano de MongoDB
        } catch (error) {
            console.log("getProductById => ", error); // Log del error si falla la operación
            throw error; // Propaga el error para ser manejado en la capa superior
        }
    }

    // Añade un nuevo producto a la base de datos
    async addProduct(productData) {
        try {
            return await productModel.create(productData); // Crea el nuevo producto con los datos proporcionados
        } catch (error) {
            console.log("addProduct => ", error); // Log del error si falla la operación
            throw error; // Propaga el error para ser manejado en la capa superior
        }
    }

    // Actualiza un producto por su ID con nuevos datos
    async updateProduct(pid, updateData) {
        try {
            // Actualiza el producto y devuelve el documento actualizado
            return await productModel.findByIdAndUpdate(pid, { ...updateData }, { new: true }).lean();
        } catch (error) {
            console.log("updateProduct => ", error); // Log del error si falla la operación
            throw error; // Propaga el error para ser manejado en la capa superior
        }
    }

    // Elimina un producto por su ID
    async deleteProduct(pid) {
        try {
            return await productModel.findByIdAndDelete(pid).lean(); // Elimina el producto y devuelve el documento eliminado
        } catch (error) {
            console.log("deleteProduct => ", error); // Log del error si falla la operación
            throw error; // Propaga el error para ser manejado en la capa superior
        }
    }
}

// Exporta una instancia del repositorio de productos
export default new ProductRepository();
