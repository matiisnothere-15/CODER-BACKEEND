import { Schema, model } from "mongoose";

const collectionName = 'Cart';

const cartSchema = new Schema({
    products: {
        type: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: [true, 'La cantidad del producto es obligatoria']
                }
            }
        ],
        default: []  // Inicializa el array de productos vacío por defecto
    }
});

// Elimina el campo __v y transforma el objeto antes de convertirlo a JSON
cartSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

export const Cart = model(collectionName, cartSchema);
