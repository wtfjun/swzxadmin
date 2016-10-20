var query = require('./mysql.js');
var md5 = require('md5');

exports.validateUser = function(req,res,account,password){
	var resultUser;
	password = md5(password);
	var result = "select * from swzx_user where account="+"'"+account+"'"+" and password="+"'"+password+"'";
	query(result,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			req.session.user = vals[0]['username'];
			req.session.id = vals[0]['user_id'];
			req.session.permission = vals[0]['permission'];

			if(req.session.permission==0){
				res.redirect('/');
			}else{
				res.redirect('/login');
			}
		}
	});

}