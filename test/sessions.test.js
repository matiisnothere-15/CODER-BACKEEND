import app from '../src/app.js'; // Ajusta la ruta según tu estructura
import { expect } from 'chai';
import mongoose from 'mongoose';
import { config } from '../src/config/config.js'; // Ajusta la ruta según tu estructura
import supertestSession from 'supertest-session';

let session;
let userId;

before(async () => {
    session = supertestSession(app);
    await mongoose.connect(config.MONGO_URL); // Aseguramos conexión a la DB antes de las pruebas
});

after(async () => {
    await mongoose.disconnect();
});

// Cada prueba crea un usuario nuevo para mantener la independencia entre ellas
beforeEach(async () => {
    console.log("TEST DE REGISTRO!".bgCyan);
    
    const response = await session
        .post('/api/sessions/registro')
        .send({
            nombre: 'Test',
            email: 'testuser@example.com',
            password: 'password123',
            age: 25
        });
        
    expect(response.status).to.equal(200); // Verificamos el registro exitoso
    userId = response.body.usuario._id;

    const loginResponse = await session
        .post('/api/sessions/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123'
        });
    expect(loginResponse.status).to.equal(200); // Verificamos el login exitoso
});

// Después de cada prueba, eliminamos el usuario creado para limpiar la base de datos
afterEach(async () => {
    console.log(`Deleting user: ${userId}`.bgBlue);
    const response = await session.delete(`/api/sessions/${userId}`);
    expect(response.status).to.equal(200);
    expect(response.body.user).to.equal('deleted user');
});

describe('Sessions Endpoints', () => {

    describe('POST /api/sessions/registro', () => {
        it('should return an error if email is already in use', async () => {
            const response = await session
                .post('/api/sessions/registro')
                .send({
                    email: 'testuser@example.com', // Mismo correo que el usado en beforeEach
                    password: 'password123',
                    nombre: 'Another User',
                    age: 30
                });
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/api/sessions/error"); // Redirección al manejo de error
        });
    });

    describe('POST /api/sessions/login', () => {
        it('should log in a user successfully', async () => {
            const response = await session
                .post('/api/sessions/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123'
                });
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.equal('Login exitoso!');
        });

        it('should return an error if credentials are incorrect', async () => {
            const response = await session
                .post('/api/sessions/login')
                .send({
                    email: 'nonexistentuser@example.com', // Correo inexistente
                    password: 'wrongpassword'
                });
            expect(response.status).to.equal(302);
            expect(response.header.location).to.equal("/api/sessions/error"); // Redirección en caso de error
        });
    });

    describe('GET /api/sessions/current', () => {
        it('should get the current user', async () => {
            const response = await session
                .get('/api/sessions/current'); // Obtener usuario actual
            expect(response.status).to.equal(200);
            expect(response.body.userDTO.email).to.equal('testuser@example.com');
        });
    });

});
