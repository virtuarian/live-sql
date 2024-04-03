// lib/db.ts
import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const pool = oracledb.createPool({
  user: process.env.ORACLE_USERNAME,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
  poolMax: 10,
  poolMin: 2,
  poolTimeout: 30
});

export default pool;
