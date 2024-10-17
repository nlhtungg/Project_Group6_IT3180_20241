const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { message: 'Welcome to HUSTHUB!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
