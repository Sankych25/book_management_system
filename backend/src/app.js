import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    // origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import adminRouters from './routes/admin.routes.js';


//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouters);
export { app };
// export default app; // Export app