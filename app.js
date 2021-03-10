var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var getRouter = require('./routes/get');
var postRouter = require('./routes/post');


// var getchemicalsRouter = require('./routes/getchemicals');
// var getjsonRouter = require('./routes/getjson');
// var getchemicallistRouter = require('./routes/getchemicallist');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://klincsekkrisztina:insomnia@cluster0.lac4v.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/get', getRouter);
app.use('/post', postRouter);

// app.use('/getchemicals', getchemicalsRouter);
// app.use('/getjson', getjsonRouter);
// app.use('/getchemicallist', getchemicallistRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
