import postgres from 'postgres';

// use schema b2b_wallet

const dbHost = process.env.DATABASE_HOST;
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

export const sql = postgres(
  `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}?sslmode=require`
);
