const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app'); 
const should = chai.should();

chai.use(chaiHttp);

describe('Productos', () => {

    // Test para manejar producto no encontrado
    it('debería devolver 404 si no se encuentra el producto', (done) => {
        chai.request(server)
            .get('/api/products/invalidID')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Producto no encontrado');
                done();
            });
    });

    // Test para manejar error de conexión a la base de datos
    it('debería devolver 500 si falla la conexión a la base de datos', (done) => {
    
        chai.request(server)
            .post('/api/products')
            .send({ name: 'Producto de prueba', price: 100 })
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Error en la conexión a la base de datos');
                done();
            });
    });

    // Test para manejar errores de validación
    it('debería devolver 400 si falla la validación al crear un producto', (done) => {
        chai.request(server)
            .post('/api/products')
            .send({ price: 100 }) 
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Faltan campos requeridos');
                done();
            });
    });
});
