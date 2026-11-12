import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

/** Centralized, typed environment configuration with safe public sandbox defaults. */
export const ENV = Object.freeze({
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://dummyjson.com',
  standardUser: process.env.STANDARD_USER ?? 'standard_user',
  lockedOutUser: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
  demoPassword: process.env.DEMO_PASSWORD ?? 'secret_sauce',
  apiUsername: process.env.API_USERNAME ?? 'emilys',
  apiPassword: process.env.API_PASSWORD ?? 'emilyspass',
  authStoragePath: path.resolve(__dirname, '..', '.auth', 'standard-user.json'),
});
