var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var tournamentRouter = require('./routes/tournament');
var indexRouter = require('./routes/index');
var manageRouter = require('./routes/manage');
const config = require('./config');
const sessions = require('express-session');
const User = require('./models/user');

const JWT_SECRET = config.SECRET;



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const halfDay = 1000 * 60 * 60 * 12;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(sessions({
  secret: JWT_SECRET,
  saveUninitialized: false,
  cookie: { maxAge: halfDay, 
    sameSite: true,
    secure: false
  },
  resave: false,
  
}));


app.use((req, res, next) => {

  if (!(req.session && req.session.userToken)) {
    return next();
  }

  User.findById(req.session.userID, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    user.password = undefined;
    req.user = user;
    res.locals.user = user;

    next();
    });
})





app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

app.use('/', indexRouter);
app.use('/manage', manageRouter);
app.use('/create-tournament', tournamentRouter);

app.disable('etag');





app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next(); 
}); 

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
