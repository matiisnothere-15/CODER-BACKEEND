import { faker } from '@faker-js/faker';

// Función para generar productos ficticios (mock) utilizando Faker.js
export const generateMockProducts = () => {
    const products = []; // Array para almacenar los productos generados

    // Genera 100 productos ficticios
    for (let i = 0; i < 100; i++) {
        const product = {
            _id: faker.string.uuid(),               // Genera un UUID único para el producto
            title: faker.commerce.productName(),    // Genera un nombre de producto
            description: faker.commerce.productDescription(), // Genera una descripción del producto
            price: faker.commerce.price(),          // Genera un precio para el producto
            stock: faker.number.int({ min: 0, max: 100 }), // Genera un número aleatorio para el stock entre 0 y 100
            category: faker.commerce.department(),  // Asigna una categoría aleatoria al producto
            thumbnails: [faker.image.url()]         // Genera una URL de imagen para el producto
        };

        products.push(product); // Añade el producto al array
    }

    return products; // Devuelve la lista de productos ficticios
};
