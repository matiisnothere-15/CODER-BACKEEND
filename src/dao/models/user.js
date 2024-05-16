import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

class UserDAO {
    async createUser(email, password) {
        const user = new User({ email, password });
        await user.save();
        return user;
    }

    async findUserByEmail(email) {
        return User.findOne({ email });
    }

    async findUserById(id) {
        return User.findById(id);
    }
}

export default new UserDAO();
