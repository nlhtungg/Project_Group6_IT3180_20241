const express = require('express');
const session = require('express-session');
const { connectDB } = require('./models/db');
const {connectDB} = require('./models/db');
const path = require('path');
const cookieParser = require('cookie-parser');
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

app.use(cookieParser());

// Middleware to authenticate token
const { authenticateToken } = require('./middlewares/authenticateToken');

// Middleware to authorize role
const { authorizeRole } = require('./middlewares/authorizeRole');

// **Correcting views directory**
app.set('views', path.join(__dirname, 'views')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(connectLivereload());

// Routes
const indexRouter = require('./routes/homeRoutes');
app.use('/', indexRouter);

const loginRouter = require('./routes/loginRoutes');
app.use('/login', loginRouter);



//Role-based routes

const adminRouter = require('./routes/adminRoutes')
app.use('/admin', authenticateToken, authorizeRole('admin'), adminRouter);

const studentRouter = require('./routes/studentRoutes');
app.use('/student', authenticateToken, authorizeRole('student'), studentRouter);

const teacherRouter = require('./routes/teacherRoutes');
app.use('/teacher', authenticateToken, authorizeRole('teacher'), teacherRouter);

//Log out
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.redirect('/login');
  });



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
