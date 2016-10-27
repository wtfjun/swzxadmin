var express = require('express');
//后台调用的控制器
var controller = require('../controller/indexController.js');
var newscontroller = require('../controller/newsController.js');
var businesscontroller = require('../controller/businessController.js');
var picturecontroller = require('../controller/pictureController.js');
//api调用的控制器
var apinewscontroller = require('../api/newsController.js');
var apinbusinesscontroller = require('../api/businessController.js');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: '事务中心管理后台' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
//router.get('/login',controller.login);

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});
//新闻相关
router.get('/addnews', newscontroller.getsmallClass);
router.post('/addnews',newscontroller.addnews);

router.get('/newslist', newscontroller.newslist);
router.post('/delnews', newscontroller.delnews);

router.get('/updatenews', newscontroller.newsdetail);
router.post('/updatenews',newscontroller.updatenews);
//事务相关
router.get('/undobusiness', businesscontroller.undobusinesslist);
router.post('/businessdetail',businesscontroller.businessdetail);

router.get('/reply',businesscontroller.startreply);
router.post('/replymsg',businesscontroller.reply);

router.get('/businesslist',businesscontroller.businesslist);

router.post('/delbusiness',businesscontroller.delbusiness);

router.post('/business_tongji',businesscontroller.tongji);

router.get('/memberlist', function(req, res, next) {
  res.render('member-list', { title: 'Express' });
});
router.get('/addmember', function(req, res, next) {
  res.render('member-add', { title: 'Express' });
});
//轮播图
router.get('/picturelist',picturecontroller.picturelist);
router.get('/addpicture', function(req, res, next) {
  res.render('picture-add', { title: '添加图片' });
});
router.post('/addpicture',picturecontroller.addpicture);
router.post('/delpicture',picturecontroller.delpicture);

//api路由
router.get('/apinews',apinewscontroller.getnews);
router.get('/apibusiness',apinbusinesscontroller.getbusiness);

module.exports = router;
