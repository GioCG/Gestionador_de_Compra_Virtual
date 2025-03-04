import { config } from 'dotenv';
import { initServer } from './configs/server.js'
import {createAdmin}from './configs/defaultAdmin.js'
import {createDefaultCategori}from './configs/defaultCategori.js'

config();
initServer();
createAdmin();
createDefaultCategori();