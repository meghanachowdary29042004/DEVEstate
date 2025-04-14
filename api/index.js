import express from 'express';
import mongoose from 'mongoose';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from "dotenv";


dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


app.use(express.json());
app.use(cookieParser());

// MongoDB connection

const db = process.env.MONGO
mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


// Define routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 300;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
  console.log('Server is running on port 3000!');
});






