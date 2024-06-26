import ProductManagerFS from './ProductManagerFS.js';
import ProductManagerMONGO from './ProductManagerMONGO.js';

class DAOFactory {
  static getDAO(type) {
    switch (type) {
      case 'FS':
        return new ProductManagerFS();
      case 'MONGO':
        return new ProductManagerMONGO();
      default:
        throw new Error('Unknown DAO type');
    }
  }
}

export default DAOFactory;
