
import faker from 'faker';

const generateMockProducts = (count = 100) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = {
      _id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      imageUrl: faker.image.imageUrl(),
      stock: faker.datatype.number({ min: 0, max: 100 }),
      category: faker.commerce.department(),
    };
    products.push(product);
  }
  return products;
};

export default generateMockProducts;

