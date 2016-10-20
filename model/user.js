var query = require('./mysql.js');
var md5 = require('md5');
//判断对象是否为空
function isEmptyObject(obj) {
	 for (var key in obj) {
	 	return false;
	 }
	 	return true;
}
//用户验证
exports.validateUser = function(req,res,account,password){
	var resultUser;
	password = md5(password);
	var result = "select * from swzx_user where account="+"'"+account+"'"+" and password="+"'"+password+"'";
	query(result,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			//判断查询结果是否为空
			if(isEmptyObject(vals)){
				res.json({error:0});
			}else{
				//信息保存到session
				req.session.user = vals[0]['username'];
				req.session.id = vals[0]['user_id'];
				req.session.permission = vals[0]['permission'];
				//判断权限并跳转到相应的目录
				if(req.session.permission==0){
					
					res.redirect('/');
				}else{
					res.redirect('/student');
				}
			}
		}
	});

}