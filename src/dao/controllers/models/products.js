import mongoose, { Schema, model } from "mongoose";

const collectionName = 'Product';

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título del producto es obligatorio'],
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
    },
    code: {
        type: String,
        required: [true, 'El código del producto es obligatorio'],
        unique: true,
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
    },
    category: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    thumbnails: [{
        type: String,
    }],
    owner: {
        type: String,
        ref: 'User',
        default: "admin",
    },
});

// Elimina el campo __v al convertir a JSON
productSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

export const Product = model(collectionName, productSchema);
