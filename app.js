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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//ueditor
var ueditor = require("ueditor");

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    else if (req.query.action === 'uploadfile'){
        var foo = req.ueditor;
        var file = req.ueditor.filename;
        var file_url = '/attachment';
        res.ue_up(file_url);
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    // 客户端发起文件列表请求
    else if (req.query.action === 'listfile') {
      var dir_url = '/attachment';
      res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));
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
    //如果是接口请求则跳过
    if(req.path=="/welcome" || req.path=="/apinews" || req.path=="/apibusiness" || req.path=="/apipostbusiness" || req.path=="/studentInfo" || req.path=="/confirmInfo"){
      next();
    }
    //如果是登录后的请求也跳过
    else if(req.path=="/"){
       next();
    } else{
        var CASserver = "https://auth.szu.edu.cn/cas.aspx/";//深圳大学统一身份认证URL**不能修改**
        var ReturnURL = "http://swzx.szu.edu.cn/sdbk/s.asp";//用户认证后跳回到您的网站，根据实际情况修改
        //header("Location: ". $CASserver ."login?service=". $ReturnURL);
        res.redirect(CASserver+"login?service="+ReturnURL);
    }
  } 
  else if (req.session.user) {
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
