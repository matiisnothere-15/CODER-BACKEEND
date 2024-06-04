import express from 'express';
import passport from 'passport';

const router = express.Router();

// Current session route
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;
