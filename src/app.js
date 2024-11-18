const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
require('dotenv').config();

const { connectDB } = require('./models/db');
const { authenticateToken } = require('./middlewares/authenticateToken');
const { authorizeRole } = require('./middlewares/authorizeRole');

// Initialize the Express app and set the port
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Set up view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is correctly set
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(connectLivereload());

// Set up livereload for development
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});

// Routes
app.use('/', require('./routes/homeRoutes'));
app.use('/login', require('./routes/loginRoutes'));

// Role-based routes with authentication and authorization middlewares
app.use('/admin', authenticateToken, authorizeRole('admin'), require('./routes/adminRoutes'));

// Log out route
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

