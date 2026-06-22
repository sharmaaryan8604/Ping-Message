
import express from 'express'
import "dotenv/config"
import User from './models/Users.js'
import { connectDb } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors'


const app = express();
const port = process.env.port;
const FRONTEND_URL= process.env.FRONTEND_URL


app.use(express.json());

app.use(clerkMiddleware())
app.use(cors({
  origin: FRONTEND_URL,credentials:true
}))


app.get('/', async (req, res) => {
  

  res.status(200).json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  connectDb()
  console.log(`Server is running on port ${port}`);
});