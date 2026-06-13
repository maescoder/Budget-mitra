const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Assuming executed from src folder or root

// Create the connection pool
// For PlanetScale, you generally pass the full URI or specific SSL options
const pool = mysql.createPool(process.env.DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'antigravity',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 2000
});

module.exports = pool;
