import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);
import "./lib/env.js";

import express from 'express'
import { connectDb } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors'
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";
import job from './lib/cron.js';
import clerkWebhook from './webhooks/clerk.webhook.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app,server } from './lib/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? process.env.port ?? 5000);
const FRONTEND_URL= process.env.FRONTEND_URL
const publicDir=path.resolve(__dirname, "../public")


app.use("/api/webhooks/clerk",express.raw({type:"application/json"}),clerkWebhook);
app.use(express.json());

app.use(clerkMiddleware())
app.use(cors({
  origin: FRONTEND_URL,credentials:true
}))


app.get('/health', async (req, res) => {
  

  res.status(200).json({ message: 'Hello, World!' });
});



app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


//if the public directory does not exist, serve the static files from the public directory
if(fs.existsSync(publicDir)){
  app.use(express.static(publicDir))

  app.get("/{*any}",(req,res,next)=>{
    res.sendFile(path.join(publicDir,"index.html"),(err)=>{next(err)})
  })
}

server.listen(PORT, () => {
  connectDb()
  console.log(`Server is running on port ${PORT}`)

  if(process.env.NODE_ENV === "production"){ 
    job.start()
  }

});
