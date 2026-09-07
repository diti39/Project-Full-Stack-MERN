import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({origin: CLIENT_URL
})); // Enable CORS for all routes 


app.use(express.json()); // Middleware to parse JSON bodies
app.use(rateLimiter); // Apply rate limiter middleware to all routes

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  });



