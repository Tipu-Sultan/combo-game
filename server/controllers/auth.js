const authService = require('../services/auth');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { token, user } = await authService.register(username, email, password);
    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { valueType, password } = req.body;
    const { token, user } = await authService.login(valueType, password);
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };