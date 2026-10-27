const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'hotelpro_secret_key_super_secure_jwt_token_2026',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { generateToken };
