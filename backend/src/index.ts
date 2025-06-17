import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoute from './routes/resumeRoute';

dotenv.config();
const app = express();

// Allow all origins and methods for CORS (for Cloud Run/Cloud deployments)
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', resumeRoute);

app.get("/", (_, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
