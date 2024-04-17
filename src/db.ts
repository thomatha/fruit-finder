const { Pool } = require('pg');
require('dotenv').config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    // This is hacky, but it didn't work without it. Circle back later if there is time.
    ssl: {
        rejectUnauthorized: false
    }
});