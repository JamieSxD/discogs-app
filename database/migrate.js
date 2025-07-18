// Add this at the very top of database/migrate.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

// Add this debug line to see if env vars are loaded
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'NOT FOUND');

async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();

    for (const file of files) {
      // Check if migration has already been run
      const { rows } = await pool.query('SELECT id FROM migrations WHERE filename = $1', [file]);

      if (rows.length === 0) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        await pool.query('BEGIN');
        try {
          await pool.query(sql);
          await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
          await pool.query('COMMIT');
          console.log(`✅ Migration ${file} completed`);
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      } else {
        console.log(`⏭️ Migration ${file} already executed`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;