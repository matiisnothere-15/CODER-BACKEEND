import { Schema, model } from "mongoose";

const collectionName = 'Message';

const messageSchema = new Schema({
    user: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es obligatorio']
    }
});

// Configura el esquema para eliminar campos innecesarios al convertir a JSON
messageSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
});

export const Message = model(collectionName, messageSchema);
