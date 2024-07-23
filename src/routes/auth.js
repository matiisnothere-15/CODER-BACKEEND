import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../dao/models/userModelo.js';

const router = express.Router();

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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });
        req.logIn(user, (err) => {
            if (err) return next(err);
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.json({ token });
        });
    })(req, res, next);
});


router.patch('/premium/:uid', async (req, res) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.role = user.role === 'user' ? 'premium' : 'user'; 
        await user.save();

        res.send(`User role updated to ${user.role}`);
    } catch (error) {
        res.status(500).send('Server error');
    }
});
router.post('/request-password-reset', requestPasswordReset); // Handle password reset request
router.post('/reset-password', resetPassword); // Handle password reset completion


export default router;
