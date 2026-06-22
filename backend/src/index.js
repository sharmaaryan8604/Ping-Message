
import express from 'express'
import "dotenv/config"
import User from './models/Users.js'
import { connectDb } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors'
import fs from "fs"
import path from "path"


const app = express();
const port = process.env.port;
const FRONTEND_URL= process.env.FRONTEND_URL
const publicDir=path.join(process.cwd(),"public")



app.use(express.json());

app.use(clerkMiddleware())
app.use(cors({
  origin: FRONTEND_URL,credentials:true
}))


app.get('/', async (req, res) => {
  

  res.status(200).json({ message: 'Hello, World!' });
});

//if the public directory does not exist, servethe static files from the public directory
if(fs.existsSync(publicDir)){
  app.use(express.static(publicDir))

  app.get("/{*any}",(req,res,next)=>{
    res.sendFile(path.join(publicDir,"index.html"),(err)=>{next(err)})
  })
}

app.listen(port, () => {
  connectDb()
  console.log(`Server is running on port ${port}`);
});