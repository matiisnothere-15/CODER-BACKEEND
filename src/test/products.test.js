const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');  // Asegúrate de que el path sea correcto
const expect = chai.expect;

chai.use(chaiHttp);

describe('Products Router', () => {
    it('Debería obtener una lista de productos', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('Debería obtener un producto por ID', (done) => {
        const productId = 'ID_VALIDO';  // Reemplaza con un ID válido de producto
        chai.request(app)
            .get(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id').eql(productId);
                done();
            });
    });

    it('Debería crear un nuevo producto', (done) => {
        const newProduct = {
            name: 'Nuevo Producto',
            price: 100,
            description: 'Descripción del nuevo producto'
        };
        chai.request(app)
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name').eql(newProduct.name);
                done();
            });
    });
});
