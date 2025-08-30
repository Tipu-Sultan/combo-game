const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gaming_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('MySQL connection pool created');

module.exports = pool;