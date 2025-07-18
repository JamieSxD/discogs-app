require('dotenv').config({ path: '.env.test' });

// Test database setup
process.env.DB_NAME = 'discogs_alerts_test';
process.env.NODE_ENV = 'test';

const { pool } = require('../src/config/database');

beforeAll(async () => {
  // Run migrations for test database
  await require('../database/migrate')();
});

afterAll(async () => {
  await pool.end();
});