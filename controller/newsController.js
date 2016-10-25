var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');

//获取到新闻分类的详情
exports.getsmallClass = function(req,res){
	query('select * from swzx_smallclass',function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			console.log(vals);
			res.render('news-add',{
				smallclass :　vals
			});
		}
	});
}


//获取新闻列表
exports.newslist = function(req,res){
	var sql = "select newsid,title,updatetime from swzx_news order by newsid desc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('news-list',{
				news_list : vals
			});
		}
	});
}

//获取要修改的新闻信息
exports.newsdetail = function(req,res){
	var newsid = req.query.nid;
	console.log(newsid);
	var sql = "select newsid,title,updatetime,content from swzx_news where newsid="+newsid;
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('news-change',{
				newsdetail :　vals
			})
		}
	});
}

//添加新闻
exports.addnews = function(req,res){
	//获取添加新闻的表单
	var title = req.body.title;
	var smallclassid = req.body.smallclass;
	var content = req.body.editorValue;

	var data = {"Title":title,"Content":content,"SmallclassId":smallclassid};
	var news = new DB('swzx_news');
	news.add(req,res,data);
}

//删除新闻
exports.delnews = function(req,res){
	var newsid = req.body.id;
	//console.log(newsid);
	var news = new DB('swzx_news');
	var data = {"Newsid":newsid};
	news.del(req,res,data);
	//res.json({status:0});
}

//修改新闻
exports.updatenews = function(req,res){
	var newsid = req.body.id;
	var title = req.body.title;
	var content = req.body.editorValue;
	console.log(content);
	var news = new DB('swzx_news');
	var data = {"Title":title,"Content":content};
	news.update(req,res,data,'newsid',newsid);
}

