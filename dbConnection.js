const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  // password is generic as it is public
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

module.exports = connection;
