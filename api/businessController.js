var query = require('../model/mysql.js');

exports.getbusiness = function(req,res){
	var msg_id = req.query.msg_id;
	var keyword = req.query.keyword;
	//根据msg_id查找信息
	if(typeof(msg_id)!='undefined'){
		var sql = "select msg_title,msg_rtime,msg_content,msg_scontent from swzx_msg where msg_id="+msg_id;
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
	}
	//搜索回复内容 
	else if(typeof(keyword)!='undefined'){
		var sql = "select msg_title,msg_rtime,msg_content,msg_scontent from swzx_msg where msg_scontent like '%"+keyword+"%'";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
	} 
	//获取全部
	else{
		var sql = "select msg_id,msg_title,msg_rtime from swzx_msg";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
	}
}