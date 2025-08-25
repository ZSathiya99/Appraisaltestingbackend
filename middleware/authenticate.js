const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("TOKEN", token);
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;  
    next();
  // });
};

module.exports = authenticate;
