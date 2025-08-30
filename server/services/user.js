const userModel = require('../models/user');

const getProfile = async (userId) => {
  const profile = await userModel.getUserProfile(userId);
  if (!profile) {
    throw new Error('User not found');
  }
  return profile;
};

const updateProfile = async (userId, { name, username, email, password }) => {
  if (!name && !username && !email && !password) {
    throw new Error('At least one field must be provided');
  }

  if (email || username) {
    const existingUser = await userModel.findUserByEmailOrUsernameExcludingId(email || '', username || '', userId);
    if (existingUser) {
      throw new Error('Email or username already in use');
    }
  }

  const connection = await require('../config/db').getConnection();
  try {
    await connection.beginTransaction();
    const updatedUser = await userModel.updateUserProfile(userId, { name, username, email, password }, connection);
    await connection.commit();
    return updatedUser;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { getProfile, updateProfile };