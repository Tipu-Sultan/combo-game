const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

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

const login = async (valueType, password) => {
  const user = await userModel.findUserByEmailOrName(valueType);
  if (!user) {
    throw new Error('User not found');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, username: user.name },
    process.env.JWT_SECRET || 'Tjdkndwrmxcxvcxvxcccnxn45',
    { expiresIn: '24h' }
  );

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

module.exports = { register, login };