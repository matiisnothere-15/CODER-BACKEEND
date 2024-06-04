import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../dao/models/userModelo.js';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = new User({ first_name, last_name, email, age, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.json({ token });
        });
    })(req, res, next);
});

export default router;
