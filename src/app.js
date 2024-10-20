const express = require('express');
const session = require('express-session');
const { connectDB } = require('./models/db');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'HMN04',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1 * 60 * 1000 
    }
}));


// **Correcting views directory**
app.set('views', path.join(__dirname, 'views')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(connectLivereload());

// Routes
const indexRouter = require('./routes/homeRoutes');
app.use('/', indexRouter);

const adminRouter = require('./routes/adminRoutes');
app.use('/admin', adminRouter);

// Server
app.listen(PORT, () => {
    console.log(`Server running on port localhost:${PORT}`);
});

// Livereload setup
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});
