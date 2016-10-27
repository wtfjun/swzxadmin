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
		return;
	}
	//搜索回复内容 
	if(typeof(keyword)!='undefined'){
		var sql = "select msg_id,msg_title,msg_rtime,msg_content,msg_scontent from swzx_msg where msg_scontent like '%"+keyword+"%'"+" order by msg_rtime desc";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
		return;
	} 
	//获取全部
	
	var sql = "select msg_id,msg_title,msg_rtime from swzx_msg order by msg_rtime desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.jsonp({business:vals});
		}
	});
	return;
	

}