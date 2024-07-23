const crypto = require('crypto');
const User = require('../dao/models/user'); // Make sure you have a User model
const { sendPasswordResetEmail } = require('../services/emailService');
const UserDTO = require('../dto/userDTO'); 

const generatePasswordResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send('User not found');
    }

    const token = generatePasswordResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, token);
    res.send('Password reset email sent');
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Ensure token hasn't expired
    });

    if (!user) {
        return res.status(400).send('Password reset token is invalid or has expired');
    }

    if (await user.matchPassword(newPassword)) { // Assumes User model has this method (from bcrypt example)
        return res.status(400).send('Cannot use the same password as before');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send('Password has been reset');
};

exports.getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized'); 
    }

    const userDTO = req.user.toDTO ? req.user.toDTO() : {
        name: req.user.name, // Assuming your User model has a 'name' field
        email: req.user.email,
        role: req.user.role,
        // ... add other relevant fields here
    };

    res.status(200).json(userDTO); 
};

module.exports = {
    requestPasswordReset,
    resetPassword,
    getCurrentUser
};
