exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
};

exports.authorizeUser = (req, res, next) => {
    if (req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
};