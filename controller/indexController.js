var user = require('../model/user.js');

exports.getClassType = function(req,res){
	res.render('index',{

	});
	
}

exports.login = function(req,res){
	var account = req.body.account;
	var password = req.body.password;
	user.validateUser(req,res,account,password);
}