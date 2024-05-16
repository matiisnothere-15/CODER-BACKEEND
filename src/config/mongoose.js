import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

export default mongoose;
