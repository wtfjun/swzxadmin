var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');

exports.userlist = function(req,res){
	var sql = 'select * from swzx_user';
	query(sql,function(err,vals,fields){
		console.log(vals);
		if(err){
			console.log(err);
		}else{
			res.render('member-list',{
				user : vals
			});
		}
	});
}

exports.addmember = function(req,res){
	var account = req.body.accountno;
	var permission = req.body.permission;
	var data = {"account":account,"permission":permission};
	console.log(data);
	var user = new DB('swzx_user');
	user.add(req,res,data);
}