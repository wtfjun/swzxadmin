var express = require('express');
var controller = require('../controller/indexController.js');
var router = express.Router();

/* GET home page. */
router.get('/', controller.getClassType);

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login',controller.login);

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});
router.get('/addnews', function(req, res, next) {
  res.render('news-add', { title: 'Express' });
});
router.get('/newslist', function(req, res, next) {
  res.render('news-list', { title: 'Express' });
});
router.get('/undobusiness', function(req, res, next) {
  res.render('business-undo', { title: 'Express' });
});
router.get('/businesslist', function(req, res, next) {
  res.render('business-list', { title: 'Express' });
});
router.get('/memberlist', function(req, res, next) {
  res.render('member-list', { title: 'Express' });
});
router.get('/addmember', function(req, res, next) {
  res.render('member-add', { title: 'Express' });
});
module.exports = router;
