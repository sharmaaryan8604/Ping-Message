// const express = require('express');
import express from 'express'
import "dotenv/config"
const app = express();
const port = process.env.port;
console.log(process.env.DB_URL)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});