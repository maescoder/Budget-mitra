const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

require('dotenv').config(); // Load .env
const DB_URL = process.env.DATABASE_URL || "mysql://root:vansh@localhost:3306";
const DB_NAME = "antigravity";

async function seed() {
  try {
    console.log("Connecting to MySQL...");
    // Connect without DB name to create it first
    const conn = await mysql.createConnection(DB_URL);

    console.log("Creating database 'antigravity'...");
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await conn.query(`USE ${DB_NAME}`);

    console.log("Creating tables from schema...");
    const schema = fs.readFileSync('../db/create_tables.sql', 'utf8');
    // Split by semi-colon but careful with comments
    const queries = schema.split(';').filter(q => q.trim().length > 0);
    for (let q of queries) {
      if (q.trim()) {
        await conn.query(q);
      }
    }

    console.log("Reading products_current.csv...");
    const products = [];
    await new Promise((resolve) => {
      fs.createReadStream('../products_current.csv')
        .pipe(csv())
        .on('data', (data) => products.push(data))
        .on('end', resolve);
    });

    console.log(`Importing ${products.length} products...`);
    for (let p of products) {
      // Simple check to avoid duplicates if run multiple times
      const [rows] = await conn.query('SELECT id FROM products WHERE product_key = ? AND platform = ?', [p.product_key, p.platform]);
      if (rows.length === 0) {
        await conn.query(
          'INSERT INTO products (product_key, category, brand, product_name, platform, price_inr, rating, reviews_count, delivery_days, image, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            p.product_key,
            p.category,
            p.brand,
            p.product_name,
            p.platform,
            parseFloat(p.price_inr) || 0,
            parseFloat(p.rating) || 0,
            parseInt(p.reviews_count) || 0,
            parseInt(p.delivery_days) || 0,
            p.image,
            p.url
          ]
        );
      }
    }

    console.log("Reading price_history_monthly.csv...");
    const history = [];
    await new Promise((resolve) => {
      fs.createReadStream('../price_history_monthly.csv')
        .pipe(csv())
        .on('data', (data) => history.push(data))
        .on('end', resolve);
    });

    console.log(`Importing ${history.length} history records...`);
    for (let h of history) {
      const [rows] = await conn.query('SELECT id FROM price_history WHERE product_key = ? AND platform = ? AND date = ?', [h.product_key, h.platform, h.date]);
      if (rows.length === 0) {
        await conn.query(
          'INSERT INTO price_history (product_key, product_name, category, platform, date, price_inr) VALUES (?, ?, ?, ?, ?, ?)',
          [h.product_key, h.product_name, h.category, h.platform, h.date, parseFloat(h.price_inr) || 0]
        );
      }
    }

    console.log("Database seeded successfully! You can now start the backend.");
    await conn.end();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n❌ ACCESS DENIED: Your MySQL 'root' user requires a password.");
      console.error("Please update the DB_URL variable in seed.js and .env with your actual password.");
    } else {
      console.error("\n❌ Seeding error:", error);
    }
    process.exit(1);
  }
}
seed();
