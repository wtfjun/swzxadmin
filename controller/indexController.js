var user = require('../model/user.js');
var query = require('../model/mysql.js');
var async = require('async');
exports.getClassType = function(req,res){
	var result=[];
	var sqls = {
		"donesum" : "select count(*) from swzx_msg where msg_scontent<>''",
		"undosum" : "select count(*) from swzx_msg where msg_scontent=''",
		"todaydonesum" : "select count(*) from swzx_msg where msg_scontent<>'' and to_days(msg_stime)=to_days(now())",
		"todayundosum" : "select count(*) from swzx_msg where msg_scontent='' and to_days(msg_stime)=to_days(now())",
		"yesterdaydonesum" : "select count(*) from swzx_msg where msg_scontent<>'' and to_days(now())-to_days(msg_stime)<=1",
		"yesterdayundosum" : "select count(*) from swzx_msg where msg_scontent<>'' and to_days(msg_stime)=to_days(now())",
		"monthdonesum" : "select count(*) from swzx_msg where msg_scontent<>'' and DATE_FORMAT(msg_stime,'%Y%m')=DATE_FORMAT(CURDATE( ),'%Y%m')",
		"monthundosum" : "select count(*) from swzx_msg where msg_scontent='' and DATE_FORMAT(msg_stime,'%Y%m')=DATE_FORMAT(CURDATE( ),'%Y%m')",
	};
	var tasks = ['donesum','undosum','todaydonesum','todayundosum','yesterdaydonesum','yesterdayundosum','monthdonesum','monthundosum'];
	async.eachSeries(tasks,function(item,callback){
		query(sqls[item],function(err,vals,fields){
			
			if(err){
				console.log(err);
			}else{
				
				console.log(vals);
				callback(err,vals,fields);
			}
		});
	},function(err){
		console.log("err");
	});
	res.render('index',{

	});
	
}

exports.login = function(req,res){
	var account = req.body.account;
	var password = req.body.password;
	user.validateUser(req,res,account,password);
}