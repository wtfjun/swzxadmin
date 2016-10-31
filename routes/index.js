var express = require('express');
//后台调用的控制器
var controller = require('../controller/indexController.js');
var newscontroller = require('../controller/newsController.js');
var businesscontroller = require('../controller/businessController.js');
var picturecontroller = require('../controller/pictureController.js');
var usercontroller = require('../controller/usercontroller.js');
//api调用的控制器
var apinewscontroller = require('../api/newsController.js');
var apibusinesscontroller = require('../api/businessController.js');
var apiqgzxcontroller = require('../api/qgzxcontroller.js');
var router = express.Router();

/* GET home page. */
/*router.get('/',function(req, res, next) {
  res.render('index', { title: '事务中心管理后台' });
});*/
//router.get('/cas',controller.getinfo);
router.get('/',controller.getinfo);
router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: '欢迎使用' });
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
router.get('/mybusiness',businesscontroller.mybusiness);

router.post('/delbusiness',businesscontroller.delbusiness);

router.post('/business_tongji',businesscontroller.tongji);

router.get('/memberlist', usercontroller.userlist);

router.get('/addmember', function(req, res, next) {
  res.render('member-add', { title: '添加用户' });
});
router.post('/addmember', usercontroller.addmember);
//轮播图
router.get('/picturelist',picturecontroller.picturelist);
router.get('/addpicture', function(req, res, next) {
  res.render('picture-add', { title: '添加图片' });
});
router.post('/addpicture',picturecontroller.addpicture);
router.post('/delpicture',picturecontroller.delpicture);

//勤工助学系统
router.post('/uploadexcel',apiqgzxcontroller.uploadexcel);
router.get('/qg',function(req,res,next){
	res.render('qg',{title:'勤工助学系统'});
});
router.get('/studentInfo',apiqgzxcontroller.studentInfo);//获取信息路由
router.get('/confirmInfo',apiqgzxcontroller.confirmInfo);//确认信息
router.post('/downloadexcel',apiqgzxcontroller.downloadexcel);
//api路由
router.get('/apinews',apinewscontroller.getnews);

router.get('/apibusiness',apibusinesscontroller.getbusiness);
router.get('/apipostbusiness',apibusinesscontroller.addbusiness);


//深大验证接口转发
router.get('/infoapi',function(req,res){
	var ticket = req.query.ticket;
	res.redirect('http://szunews.com/passport/cas.php?ticket='+ticket);
});
module.exports = router;
