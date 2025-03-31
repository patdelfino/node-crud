var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var mongoose = require('mongoose');
var productsRouter = require('./routes/products'); // Updated route name
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');

require('./models/Product'); // Register the Product model

var app = express();
var PORT = 8000;

// Database Connection
async function connect() {
  try {
    const uri = "mongodb+srv://pdelfino30:yC7OwNA7nVBserrA@cluster0.oovze.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
}

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/products', productsRouter); // Updated route path
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error Handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Start Server
async function startServer() {
  await connect();
  app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`);
  });
}

startServer();

module.exports = app;