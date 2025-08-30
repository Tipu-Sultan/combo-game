const userService = require('../services/user');

const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.userId);
    res.json(profile);
  } catch (error) {
    console.error('User profile error:', error.message);
    res.status(404).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const updatedUser = await userService.updateProfile(req.user.userId, { name, username, email, password });
    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getProfile, updateProfile };