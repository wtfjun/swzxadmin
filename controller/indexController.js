var user = require('../model/user.js');
var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
//获取到新闻分类的详情
exports.getsmallClass = function(req,res){
	/*var result=[];
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
	});*/
	query('select * from swzx_smallclass',function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			console.log(vals);
			res.render('news-add',{
				smallclass :　vals
			});
		}
	});
}


exports.login = function(req,res){
	/*var account = req.body.account;
	var password = req.body.password;
	user.validateUser(req,res,account,password);*/
	var ticket = req.query.ticket;
	if(typeof(ticket)=='undefined'){
		res.redirect('https://auth.szu.edu.cn/cas.aspx/login?service=http://swzx.szu.edu.cn/sdbk/swzx.asp');
	}else{
		var CASserver = 'https://auth.szu.edu.cn/cas.aspx/';      //深圳大学统一身份认证URL**不能修改**
   	 	var ReturnURL = 'http://swzx.szu.edu.cn/sdbk/swzx.asp';   //用户认证后跳回到您的网站，根据实际情况修改
    	var url = CASserver+'serviceValidate?ticket='+ticket+'&service='+ReturnURL;
    	console.log(url);
    	/*request.get('www.baidu.com', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body) // Show the HTML for the Google homepage.
		  }
		  console.log(1);
		});*/
		/*request.get({url:url,from:{ticket:ticket,service:ReturnURL}},function(error,response,body){
			if (!error && response.statusCode == 200) {
		    console.log(body) // Show the HTML for the Google homepage.
		  }
		  console.log(body);
		});*/
		//var request = require('request');
		/*request.get('http://www.baidu.com', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(1) // Show the HTML for the Google homepage.
		  }
		});*/
		
	}
	/**/

}