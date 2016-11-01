var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
var multiparty = require('multiparty');
var fs = require('fs');

//获取全部图片
exports.picturelist = function(req,res){
	var sql = "select * from swzx_picture order by sort asc";
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
		}else{
			res.render('picture-list',{
				picture_list : vals
			});
		}
	});
}

exports.addpicture = function(req,res){

	var form = new multiparty.Form({uploadDir: './public/images/navimg/'});
   //上传完成后处理
    form.parse(req, function(err, fields, files) {

      var filesTmp = JSON.stringify(files,null,2);
  
      if(err){
       //console.log('parse error: ' + err);
      } else {
       //console.log('parse files: ' + filesTmp);
        var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/images/navimg/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
         if(err){
           //console.log('rename error: ' + err);
         } else {
            //console.log('rename ok');
            dstPath = dstPath.slice(8);
            dstPath = "http://"+req.hostname+":3000"+dstPath;
            var picture = new DB('swzx_picture');
            var data={path:dstPath,sort:fields.sort};
            picture.add(req,res,data);
          }
        });
     }
    
      /*res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: filesTmp}));*/
   });
}
//删除图片
exports.delpicture = function(req,res){
  var pic_id = req.body.id;
  var picture = new DB('swzx_picture');
  var data = {pic_id:pic_id};
  picture.del(req,res,data);
}
