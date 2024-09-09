import { Schema, model } from "mongoose";

const collectionName = 'Ticket';

const ticketSchema = new Schema({
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'El ID del producto es obligatorio']
            },
            quantity: {
                type: Number,
                required: [true, 'La cantidad del producto es obligatoria']
            },
            title: {
                type: String,
                required: [true, 'El título del producto es obligatorio']
            },
            description: {
                type: String,
                required: [true, 'La descripción del producto es obligatoria']
            },
            price: {
                type: Number,
                required: [true, 'El precio del producto es obligatorio']
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'El precio total es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Ticket = model(collectionName, ticketSchema);
