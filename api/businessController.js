var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
exports.getbusiness = function(req,res){
	var msg_id = req.query.msg_id;//根据id获取内容
	var keyword = req.query.keyword;//根据关键词获取
	var xsh_number = req.query.number;//根据学号获取询问过的事务
	//根据msg_id查找信息
	if(typeof(msg_id)!='undefined'){
		var sql = "select msg_title,msg_rtime,msg_stime,msg_sbmname,msg_content,msg_scontent from swzx_msg where msg_id="+msg_id;
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
		var sql = "select msg_id,msg_title,msg_rtime,msg_stime,msg_sbmname,msg_content,msg_scontent from swzx_msg where msg_scontent like '%"+keyword+"%' and msg_oorc=1"+" order by msg_rtime desc";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
		return;
	} 
	//根据学号获取
	if(typeof(xsh_number)!='undefined'){
		var sql = "select * from swzx_msg where xsh_number="+xsh_number+" order by msg_rtime desc";
		query(sql,function(err,vals,fields){
			if(err){
				console.log(err);
			}else{
				res.jsonp({business:vals});
			}
		});
		return;
	} 	//获取全部
	
	var sql = "select msg_id,msg_title,msg_rtime,msg_stime from swzx_msg where msg_oorc=1 order by msg_rtime desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.jsonp({business:vals});
		}
	});
	return;
	

}
//事务上报
exports.addbusiness = function(req,res){
	var bf = req.query.businessForm;
	console.log(bf);
	var xsh_name = bf.name;//姓名
	var xsh_number = bf.studentno;//学号
	var xsh_col = bf.academy;//学院
	var xsh_mail = bf.email;//邮箱
	var xsh_tel = bf.telphone;//手机号码

	var msg_title = bf.title;//事务标题
	var msg_content = bf.content;//事务内容
	var msg_oorc = bf.businessinfo;//是否公开
	var business = new DB('swzx_msg');
	var data = {"xsh_name":xsh_name,"xsh_number":xsh_number,"xsh_col":xsh_col,"xsh_mail":xsh_mail,"xsh_tel":xsh_tel,"msg_title":msg_title,"msg_content":msg_content,"msg_oorc":msg_oorc};
	business.add(req,res,data,1);
}
//查询个人询问记录
exports.getmybusiness = function(req,res){
	var xsh_number = req.query.studentno;
	var sql = "select * from swzx_msg where xsh_number="+xsh_number;
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.jsonp({business:vals});
		}
	});
}