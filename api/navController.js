var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
/*
*	列出所有的导航栏
*/
exports.navlist = function(req,res){
	query('select * from swzx_navbar where parent_id<>0 order by parent_id',function(err,vals,field){
		if(err){
			console.log(err);
		}else{
			res.render('nav-list',{
				nav_list : vals
			});
		}
	});
}
/*
*	添加导航栏
*/
exports.addnav = function(req,res){
	var nav_name = req.body.nav;
	var url = req.body.url;
	var parent_id = req.body.navid;
	var data = {"nav_name":nav_name,"parent_id":parent_id,"url":url};
	var nav = new DB('swzx_navbar');
	nav.add(req,res,data);
}
/*
*	删除导航栏
*/
exports.delnav = function(req,res){
	var nav_id = req.body.id;
	var nav = new DB('swzx_navbar');
	var data = {"nav_id":nav_id};
	nav.del(req,res,data);
}

/*
*	把导航栏返回给调用的页面
*	@return jsonp(包含了名称，url(为空代表展示作用))
*/
exports.getnav = function(req,res){
	var nav_id = req.query.id;	//1代表进驻部门,2代表其他事务
	query('select * from swzx_navbar where parent_id='+nav_id,function(err,vals,field){
		if(err){
			console.log(err);
		}else{
			
			res.jsonp({nav:vals});
		}
	});
}

