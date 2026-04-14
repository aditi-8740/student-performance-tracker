const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const cors = require('cors');
connectDB();

app.use(cors({
  origin: "http://localhost:5173", // Allow only your React app
  credentials: true                // Allow cookies/headers if needed
}));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api',classRoutes);
app.use('/api',assignmentRoutes);
app.use('/api',gradeRoutes);
app.use('/api',performanceRoutes)
//test route
app.get('/', (req, res) => {
  res.send('Hello World!my worlddd')
})

app.listen(process.env.PORT , () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
