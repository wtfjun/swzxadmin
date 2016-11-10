var request = require('request');
var query = require('../model/mysql.js');
/*
*	功能：获取信息并存入session
*/
exports.getinfo = function(req,res){
	var ticket = req.query.ticket;
	//console.log(ticket);
	if(typeof(ticket)!='undefined'){
		//判断是否已经有了session值，有的话则跳过
		if(typeof(req.session.user)=='!undefined'){
			res.render('index',{
		    	permission : req.session.permission,
		    	name : req.session.name
		    });
		    
		}else{
			var url = 'http://210.39.2.88/qgzx/?ticket='+ticket;
			request.get(url,function(error,response,body){
				if (!error && response.statusCode == 200) {
				    body = eval("(" + body + ")");//把获取的数据转化为json
				    //信息存入session中
				    req.session.user = body.user;
				    req.session.name = body.name;
				    req.session.studentno = body.studentno;
				    req.session.rankname = body.rankname;
				    //console.log(req.session);
				    var sql = 'select permission from swzx_user where account='+req.session.studentno;
				    query(sql,function(err,vals,fields){
				    	if(err){
				    		console.log(err);
				    	}else{
				    		//console.log(vals);
				    		if(vals.length==0){
				    			res.redirect('/404');
				    		}else{
					    		req.session.permission = vals[0].permission;
					    		res.render('index',{
							    	permission : vals[0].permission,
							    	name : req.session.name
							    });
					    	}
				    	}
				    });
				    
				 }
			});
		}
		//res.redirect(url);

	}else{
		var CASserver = "https://auth.szu.edu.cn/cas.aspx/";//深圳大学统一身份认证URL**不能修改**
		var ReturnURL = "http://swzx.szu.edu.cn/sdbk/s.asp";//用户认证后跳回到您的网站，根据实际情况修改
		//header("Location: ". $CASserver ."login?service=". $ReturnURL);
		res.redirect(CASserver+"login?service="+ReturnURL);
	}
}
