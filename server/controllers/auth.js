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
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const { token, user } = await authService.login(valueType, password, ipAddress, userAgent);

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // raw token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }


    await authService.logout(token);

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

module.exports = { register, login,logout };