const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const sessionModel = require('../models/sessionModel');

const register = async (username, email, password) => {
  const existingUser = await userModel.findUserByEmailOrName(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(username, email, hashedPassword);

  const token = jwt.sign(
    { userId: user.id, email },
    process.env.JWT_SECRET || 'Tjdkndwrmxcxvcxvxcccnxn45',
    { expiresIn: '24h' }
  );

  return { token, user };
};

const login = async (valueType, password, ipAddress, userAgent) => {
  const user = await userModel.findUserByEmailOrName(valueType);
  if (!user) {
    throw new Error('User not found');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email, username: user.name },
    process.env.JWT_SECRET || 'Tjdkndwrmxcxvcxvxcccnxn45',
    { expiresIn: '24h' }
  );

  // Hash token before saving (never store raw token)
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Expiry date (same as JWT 24h)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Save session
  await sessionModel.createSession({
    userId: user.id,
    tokenHash,
    ipAddress,
    userAgent,
    expiresAt,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      balance: user.balance,
    },
  };
};

const logout = async (token) => {
  // hash it (same as when stored)
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // delete session
  await sessionModel.deleteSession(tokenHash);

  // return result (no res.json here!)
  return true;
};

module.exports = { register, login,logout };