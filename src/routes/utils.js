import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDAO from '../dao/UserDAO.js';

const router = express.Router();

// Configuración de Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserDAO.findUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Email no registrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserDAO.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Registro
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserDAO.createUser(email, hashedPassword);
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar');
    }
});

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

export default router;
