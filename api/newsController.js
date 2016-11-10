var query = require('../model/mysql.js');

exports.getnews = function(req,res){
	var smallclassid = req.query.smallclassid;
	var newsid = req.query.newsid;
	if(typeof(smallclassid)!='undefined'){
		var sql = "select Newsid,Title,UpdateTime from swzx_news where smallclassid="+smallclassid+" order by UpdateTime desc";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({news:vals});
			}
		});
		return;
	} 
	if(typeof(newsid)!='undefined'){
		var sql = "select Title,UpdateTime,Content from swzx_news where newsid="+newsid;
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({news:vals});
			}
		});
		return;
	} 
	res.jsonp({news:'access denied'});
	return;
}
/*
*	获取新闻公告，因为新闻公告包含了中心新闻和通知公告
*
*/
exports.getnewsgg = function(req,res){
	var sql = "select Newsid,Title,UpdateTime from swzx_news where smallclassid=1 or smallclassid=2 order by UpdateTime desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.jsonp({news:vals});
		}
	});
	return;
}

/*
*	获取办事指南，因为新闻公告包含了进驻中心项目和其他办事流程
*
*/
exports.getguide = function(req,res){
	var sql = "select Newsid,Title,UpdateTime from swzx_news where smallclassid=23 or smallclassid=22 order by UpdateTime desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.jsonp({news:vals});
		}
	});
	return;
}