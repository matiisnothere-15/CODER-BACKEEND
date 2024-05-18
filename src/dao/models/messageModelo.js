import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
});

export const messageModelo = mongoose.model('Message', messageSchema);
