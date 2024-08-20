const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Carts Router', () => {
    it('Debería obtener el carrito por ID', (done) => {
        const cartId = 'ID_VALIDO';  
        chai.request(app)
            .get(`/api/carts/${cartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id').eql(cartId);
                done();
            });
    });

    it('Debería agregar un producto al carrito', (done) => {
        const cartId = 'ID_VALIDO';
        const product = { productId: 'ID_PRODUCTO_VALIDO', quantity: 1 };
        chai.request(app)
            .post(`/api/carts/${cartId}/product`)
            .send(product)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('products');
                done();
            });
    });

    it('Debería eliminar un producto del carrito', (done) => {
        const cartId = 'ID_VALIDO';
        const productId = 'ID_PRODUCTO_VALIDO';
        chai.request(app)
            .delete(`/api/carts/${cartId}/product/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
