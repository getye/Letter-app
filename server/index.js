const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('./routes/userRouter');
require('dotenv').config();
const path = require('path');
const { connectDB } = require('./dbcon');
const roleRouter = require('./routes/roleRouter');
const officeRouter = require('./routes/officeRouter');
const headerRouter = require('./routes/headerRouter');
const footerRouter = require('./routes/footerRouter');
const receiversRouter = require('./routes/receiversRouter');
const ccsRouter = require('./routes/ccsRouter');
const letterRouter = require('./routes/letterRouter');
const approverRouter = require('./routes/approverRouter');

const app = express();
app.use(express.json());

// Allow CORS for the /uploads route
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit to 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase URL-encoded payload limit

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

connectDB();

app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/offices', officeRouter);
app.use('/api/headers', headerRouter);
app.use('/api/footers', footerRouter);
app.use('/api/receivers', receiversRouter);
app.use('/api/ccs', ccsRouter);
app.use('/api/letters', letterRouter);
app.use('/api/approvers', approverRouter);


const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
