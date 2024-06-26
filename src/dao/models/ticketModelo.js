import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
});

ticketSchema.pre('save', function(next) {
  this.code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  next();
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
