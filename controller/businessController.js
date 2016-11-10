var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
var async = require('async');
//获取未办理的事务列表
exports.undobusinesslist = function(req,res){
	var sql = "select msg_id,msg_title,msg_rtime from swzx_msg where msg_scontent='' or msg_scontent IS NULL";
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
	var sql = "select msg_id,xsh_number,msg_title,msg_rtime,msg_scontent,msg_sbeizhu from swzx_msg order by msg_rtime desc";
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
//获取我回复的事务
exports.mybusiness = function(req,res){
	var sql = "select msg_id,msg_title,msg_rtime,msg_stime from swzx_msg where msg_ename='"+req.session.studentno+"' or msg_ename='"+req.session.name+"'";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('business-mylist',{
				mybusiness : vals
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
	console.log(1);
	var msg_id = req.body.id;//id

	var msg_sbmname = req.body.apartment;//回复部门
	(typeof(msg_sbmname)=='undefined')?msg_sbmname=null:1;

	var msg_dname = req.body.dname;//部门回复人
	(typeof(msg_dname)=='undefined')?msg_dname=null:1;

	var msg_dtel = req.body.dtel;//回复人联系方式
	(typeof(msg_dtel)=='undefined')?msg_dtel=null:1;

	var msg_ename = req.session.studentno;//经办人
	(typeof(msg_ename)=='undefined')?msg_ename=null:1;

	var msg_sbeizhu = req.body.remark;//备注
	(typeof(msg_sbeizhu)=='undefined')?msg_sbeizhu=null:1;

	var msg_scontent = req.body.editorValue;//回复内容
	var msg_stime = getNowFormatDate();
	var business = new DB('swzx_msg');
	var data = {msg_scontent:msg_scontent,msg_stime:msg_stime,msg_sbmname:msg_sbmname,msg_dname:msg_dname,msg_dtel:msg_dtel,msg_ename:msg_ename,msg_sbeizhu:msg_sbeizhu};
	console.log(data);
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

/*
*	功能：获取当前时间“yyyy-MM-dd HH:MM:SS”
*/
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}