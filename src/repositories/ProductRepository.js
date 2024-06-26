class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async getAllProducts() {
      return await this.dao.getAll();
    }
  
    async getProductById(id) {
      return await this.dao.getById(id);
    }
  
    async createProduct(productData) {
      return await this.dao.create(productData);
    }
  
    async updateProduct(id, productData) {
      return await this.dao.update(id, productData);
    }
  
    async deleteProduct(id) {
      return await this.dao.delete(id);
    }
  }
  
  export default ProductRepository;
  