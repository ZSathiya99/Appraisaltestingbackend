const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "appraisal_backend";

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("TOKEN", token);
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;  
    next();
  });
};

module.exports = authenticate;
