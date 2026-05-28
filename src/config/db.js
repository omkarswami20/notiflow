const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
  max: 10,                  // max connections
  idleTimeoutMillis: 30000, // 30 sec idle timeout
  connectionTimeoutMillis: 10000, // 10 sec connection timeout
})

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err.message) // sirf message, pura object nahi
})

module.exports = pool