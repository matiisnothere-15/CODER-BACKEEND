const UserDTO = require('../dto/userDTO'); 

exports.getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).send('Unauthorized'); 
    }

    
    const userDTO = req.user.toDTO ? req.user.toDTO() : {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
       
    };

    res.status(200).json(userDTO); 
};

  