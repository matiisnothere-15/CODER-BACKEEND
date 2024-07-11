import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now }, // Valor por defecto de la fecha actual
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

// Middleware pre-save para generar un código único
ticketSchema.pre('save', function(next) {
    this.code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
    next();
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
