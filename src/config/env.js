import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// console.log('Current NODE_ENV:', process.env.NODE_ENV);

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  HOST,
  CLIENT_ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} = process.env;
