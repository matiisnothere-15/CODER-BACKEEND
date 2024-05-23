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

userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
      bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    } else {
      return next();
    }
  });
  
  // Método para comparar contraseñas
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

export default new UserDAO();
