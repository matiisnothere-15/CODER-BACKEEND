import { productsModelo } from './models/productsModelo.js';

class ProductManagerMongo {
    async getAllProducts() {
        try {
            return await productsModelo.find({});
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productsModelo.findById(id);
        } catch (error) {
            console.error("Error al obtener producto:", error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const newProduct = new productsModelo(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            return await productsModelo.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productsModelo.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
}

export default ProductManagerMongo;
