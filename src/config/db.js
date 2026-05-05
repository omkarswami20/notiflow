const { Pool } = require('pg')
require('dotenv').config()


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:process.env.DATABASE_URL.includes('localhost') ? false : {rejectUnauthorized: false}
})


pool.on('connect', () => {
    console.log('Connected to PostgreSQL database')
})


pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})


// // DB connection test - baad mein hata denge
// const testConnection = async () => {
//   try {
//     const client = await pool.connect()
//     console.log('DB connection test successful!')
//     client.release()
//   } catch (err) {
//     console.error('DB connection failed:', err.message)
//   }
// }

// testConnection()


module.exports =pool