import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { dbConnection } from '../src/database/config.js';
import supertestSession from 'supertest-session';

await dbConnection();

const request = supertestSession(app);

describe('Products API', () => {

    let token;
    let idProducto;

    // Inicio de sesión antes de las pruebas para obtener el token
    before(async () => {
        const loginResponse = await request.post('/api/sessions/login')
            .send({
                email: "adminCoder@coder.com",
                password: "adminCod3r123"
            });

        token = loginResponse.body.token;
        expect(token).to.exist; // Verificar que el token exista
    });

    // Obtener lista de productos
    it('should return a list of products', async () => {
        const res = await request.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    // Obtener un producto por ID
    it('should return a product by ID', async () => {
        const productId = "668741a36d044d526dd5e12b";  //? Cambiar por un ID válido en tu base de datos
        const res = await request.get(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', productId);
    });

    // Crear un nuevo producto
    it('should create a new product', async () => {
        const newProduct = {
            title: "test",
            description: "Descripcion de test",
            price: 1580,
            code: "test-zapatos",
            stock: 47,
            category: "Zapatos",
            thumbnails: ["https://test.com"]
        };

        const res = await request.post('/api/products')
            .send(newProduct)
            .set('Authorization', `Bearer ${token}`);

        idProducto = res.body._id; // Guardar el ID del producto creado
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        expect(res.body.title).to.equal(newProduct.title);
    });

    // Actualizar un producto existente
    it('should update an existing product', async () => {
        const updatedData = {
            title: "Producto actualizado",
            price: 150
        };

        const res = await request.put(`/api/products/${idProducto}`)
            .send(updatedData)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', idProducto);
        expect(res.body.title).to.equal(updatedData.title);
    });

    // Eliminar un producto por ID
    it('should delete a product by ID', async () => {
        const res = await request.delete(`/api/products/${idProducto}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
    });

    // Manejar la creación fallida debido a entrada inválida
    it('should handle invalid input when creating a product', async () => {
        const invalidProduct = {
            title: "",  // Campo obligatorio vacío, debe arrojar un error
            description: "Descripción inválida"
        };

        const res = await request.post('/api/products')
            .send(invalidProduct)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message'); // Asegúrate de que el mensaje de error esté presente
    });
});
