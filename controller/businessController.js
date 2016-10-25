var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
//获取未办理的事务列表
exports.undobusinesslist = function(req,res){
	var sql = "select msg_id,msg_title,msg_rtime from swzx_msg where msg_scontent=''";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('undobusiness-list',{
				undobusiness_list : vals
			});
		}
	});
}
//获取全部事务
exports.businesslist = function(req,res){
	var sql = "select msg_id,msg_title,msg_rtime,msg_scontent,msg_sbeizhu from swzx_msg order by msg_rtime desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('business-list',{
				business_list : vals
			});
		}
	});
}
//获取某条事务的详情
exports.businessdetail = function(req,res){
	var msg_id = req.body.id;
	var sql = 'select msg_title,msg_rtime,msg_content from swzx_msg where msg_id='+msg_id;
	console.log(sql);
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			console.log(vals);
			res.json({title:vals[0].msg_title,content:vals[0].msg_content});			
		}
	})
}

//回复事务
exports.startreply = function(req,res){
	var msg_id = req.query.id;
	var sql = 'select msg_title,msg_id,msg_content from swzx_msg where msg_id='+msg_id;
	console.log(sql);
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			console.log(vals);
			res.render('reply',{
				detail : vals
			});			
		}
	})
}
//获取回复内容并更新
exports.reply = function(req,res){
	var msg_id = req.body.id;
	var msg_scontent = req.body.editorValue;
	//console.log(msg_id);
	//console.log(msg_scontent);
	var business = new DB('swzx_msg');
	var data = {msg_scontent:msg_scontent};
	business.update(req,res,data,'msg_id',msg_id);
	
}
//删除事务
exports.delbusiness = function(req,res){
	var msg_id = req.body.id;
	//console.log(newsid);
	var news = new DB('swzx_msg');
	var data = {"msg_id":msg_id};
	news.del(req,res,data);
}

//统计事务
exports.tongji = function(req,res){
	var starttime = req.body.starttime;
	var endtime = req.body.endtime;
	if(typeof(endtime)=='undefined'){
		endtime = new Date();
	}
	var sum;
	var sum1;
	var sql = "select count(*) as sum from swzx_msg where msg_scontent<>'' and msg_rtime<'"+endtime+"' and msg_rtime>'"+starttime+"'";
	var sql1 = "select count(*) as sum from swzx_msg where msg_scontent='' and msg_rtime<'"+endtime+"' and msg_rtime>'"+starttime+"'";
	console.log(sql);
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			sum = vals;
			console.log(sum);
			query(sql1,function(err,vals,fields){
				if(err){
					console.log(err);
				}else{
					sum1 = vals;
					console.log(sum1);
					res.render('business-tongji',{
						sum : sum,
						sum1 : sum1
					});
				}
			})
		}
	});
}