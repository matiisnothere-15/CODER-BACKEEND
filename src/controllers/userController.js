export const getCurrentUser = (req, res) => {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }
    const userDTO = {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    };
    res.json(userDTO);
  };
  