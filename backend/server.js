const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
connectDB();

app.use(cors({
  origin: "*",           // Later restrict to frontend URL
  credentials: true      // Allow cookies/headers if needed
}));
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/classes',classRoutes);
app.use('/api/assignments',assignmentRoutes);
app.use('/api/users',userRoutes);

//test route
app.get('/', (req, res) => {
  res.send('Hello World!my worlddd')
})

app.listen(process.env.PORT , () => {
  console.log(`Server running on port ${PORT}`)
})
