var query = require('../model/mysql.js');

exports.getnews = function(req,res){
	var smallclassid = req.query.smallclassid;
	var newsid = req.query.newsid;
	if(typeof(smallclassid)!='undefined'){
		var sql = "select Newsid,Title,UpdateTime from swzx_news where smallclassid="+smallclassid;
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({news:vals});
			}
		});
	} else if(typeof(newsid)!='undefined'){
		var sql = "select Title,UpdateTime,Content from swzx_news where newsid="+newsid;
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({news:vals});
			}
		});
	} else{
		res.jsonp({news:'access denied'});
	}
}