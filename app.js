var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//开启session
app.use(session({
  resave:true,
  saveUninitialized:false,
  cookie:{
      maxAge: 1000*60*60 // default session expiration is set to 1 hour
    },
  secret:'swzx'
}));
//有访问时候刷新session时间
app.use(function(req, res, next){
  req.session._garbage = Date();
  req.session.touch();
  next();
});
//判断用户是否登录
app.use(function(req,res,next){
  if (!req.session.user) {
    if(req.url=="/login"){
       next();//如果请求的地址是登录则通过，进行下一个请求
    } else{
       res.redirect('/login');
    }
    } else if (req.session.user) {
        next();
    }
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
