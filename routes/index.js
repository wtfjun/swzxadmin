var express = require('express');
var controller = require('../controller/indexController.js');
var newscontroller = require('../controller/newsController.js');
var businesscontroller = require('../controller/businessController.js');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: '事务中心管理后台' });
} );

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
//router.get('/login',controller.login);

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});

router.get('/addnews', newscontroller.getsmallClass);
router.post('/addnews',newscontroller.addnews);

router.get('/newslist', newscontroller.newslist);
router.post('/delnews', newscontroller.delnews);

router.get('/updatenews', newscontroller.newsdetail);
router.post('/updatenews',newscontroller.updatenews);

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
module.exports = router;
