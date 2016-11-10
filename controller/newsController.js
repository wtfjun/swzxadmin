var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
var multiparty = require('multiparty');
var fs = require('fs');

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
	var sql = "select newsid,title,updatetime from swzx_news order by newsid desc limit 1000";
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
	/*var title = req.body.title;
	var smallclassid = req.body.smallclass;
	var content = req.body.editorValue;

	var data = {"Title":title,"Content":content,"SmallclassId":smallclassid};
	if(typeof(content)!='undefined'){
		var news = new DB('swzx_news');
		news.add(req,res,data);
	}else{
		res.redirect('/addnews');
	}*/
	var form = new multiparty.Form({uploadDir: './public/attachment/'});
   //上传完成后处理
    form.parse(req, function(err, fields, files) {

      var filesTmp = JSON.stringify(files,null,2);
  	  //如果没有上传附件，则把数据加入即可
  	  if(files.inputFile[0].size==0){
  	  	 var news = new DB('swzx_news');
         var data = {"Title":fields.title,"Content":fields.editorValue,"SmallclassId":fields.smallclass,"AdminAuthor":req.session.name};
         news.add(req,res,data);
  	  }else{
  	  	var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/attachment/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
         if(err){
           //console.log('rename error: ' + err);
         } else {
            //console.log('rename ok');

            dstPath = dstPath.slice(8);
            dstPath = "http://"+req.hostname+":3000"+dstPath;
            var content = fields.editorValue+'<br /><a href="'+dstPath+'" target="_blank">'+inputFile.originalFilename+'</a>';
            var news = new DB('swzx_news');
            var data = {"Title":fields.title,"Content":content,"SmallclassId":fields.smallclass,"AdminAuthor":req.session.name};
            news.add(req,res,data);
          }
        });
  	  }
     /* if(err){
       //console.log('parse error: ' + err);
      } else {
       //console.log('parse files: ' + filesTmp);
        var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/attachment/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
         if(err){
           //console.log('rename error: ' + err);
         } else {
            //console.log('rename ok');

            dstPath = dstPath.slice(8);
            var content = fields.editorValue'<br /><a href="'+dstPath+'"></a>';
            var news = new DB('swzx_news');
            var data = {"Title":fields.title,"Content":content,"SmallclassId":fields.smallclassid};
            news.add(req,res,data);
          }
        });
     }*/
    
      /*res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: filesTmp}));*/
   });
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

