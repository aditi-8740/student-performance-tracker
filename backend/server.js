import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import classRoutes from './routes/classRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import config from './config/config.js';
import morgan from 'morgan';

connectDB();

app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({
  origin: config.CLIENT_URL,  // Allow requests from this origin
  credentials: true,      // Allow cookies/headers if needed
  maxAge: 3600  // Pre-flight cache
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);

//test route
app.get('/', (req, res) => {
  res.send('Hello World!my worlddd')
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
