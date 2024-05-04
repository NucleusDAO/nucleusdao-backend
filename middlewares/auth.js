const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
  // Get token from request headers or query parameters
  let token = req.headers.authorization || req.query.token
  if (token && token.startsWith('Bearer ')) {
    // Remove the Bearer prefix to extract the token
    token = token.substring(7);
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
