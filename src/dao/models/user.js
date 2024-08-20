const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' },
    premium: {
        type: Boolean,
        default: false
    },
    // Additional fields from the other snippet
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date 
});

// Password hashing pre-save hook
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { 
        return next();
    }
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next(); 
});

// Update last_connection pre-save hook
userSchema.pre('save', function (next) {
    if (this.isModified('last_connection')) {
        this.last_connection = new Date();
    }
    next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
