var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
var multiparty = require('multiparty');
var fs = require('fs');
var xlsx = require("node-xlsx");

/*
* 功能:处理上传的excel表格并存入数据库
*/
exports.uploadexcel = function(req,res){
	var form = new multiparty.Form({uploadDir: './public/qgzx/'});
   //上传完成后处理
    form.parse(req, function(err, fields, files) {

      var filesTmp = JSON.stringify(files,null,2);
  
      if(err){
       //console.log('parse error: ' + err);
      } else {
       //console.log('parse files: ' + filesTmp);
        var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var dstPath = './public/qgzx/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
         if(err){
          // console.log('rename error: ' + err);
         } else {
            //console.log('rename ok');
            
          }
        //将文件内容转化为xlsx对象
        var list = xlsx.parse(dstPath);
        //console.log(list[0].data.length);
        var qgzx = list[0].data;
   
        var length = qgzx.length-1;
        //组装sql语句实现批量插入
        var sql = "insert into swzx_qgzx(p_id,studentNo,studentName,workplaces,cardNo,workingHours,wages) values";
        for(var i=1; i<=length; ++i){
        	sql += "(";
        	for(var j=0; j<qgzx[i].length-1; ++j){
	        	sql +="'"+qgzx[i][j]+"',";
	        }
	        sql +="'"+qgzx[i][j]+"'),";
        }
        sql = sql.slice(0,sql.length-1);
        //console.log(sql);
        //先清除之前的数据再插入
        query('delete from swzx_qgzx',function(err,vals,fields){
            query(sql,function(err,vals,fields){
              if(err){
                console.log(err);
              }else{
                console.log('xlxs导入成功');
              }
            });
        });
        
        });
     }
    
      /*res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: filesTmp}));*/
   });
}

/*
* 功能：将数据库的签认情况导出
*/
exports.downloadexcel = function(req,res){
  var sql = "select * from swzx_qgzx";
  query(sql,function(err,vals,fields){
    if(err){
      console.log(err);
    }else{
      var data=mysqltoexcel(vals);
      //console.log(result);
      var path = './public/qgzx/勤工助学签认结果.xlsx';
      var buffer = xlsx.build([{name: "sheet1", data: data}]);
      fs.writeFileSync(path, buffer, 'binary');
      res.download(path); 
    }
  });

	/*var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
  var buffer = xlsx.build([{name: "mySheetName", data: data}]);
  fs.writeFileSync('./public/qgzx/b.xlsx', buffer, 'binary');*/
  
//  res.download('./public/qgzx/b.xlsx'); 
}
/*
* 功能:处理学生签认的信息
* 需要传递的数据为id值还有卡号
*/
exports.confirmInfo = function(req,res){
  var p_id = req.query.id;//id值
  var cardNo = req.query.card;//卡号
  var data;//json数据，要修改的字段以及值
  //判断是否修改了卡号
  query('select cardNo from swzx_qgzx where p_id='+p_id,function(err,vals,fields){
    if(err){
      console.log(err);
    }else{
      if(cardNo!=vals){
        data = {"isConfirm":"已确认","isChange":"已修改","newCardNo":cardNo};
      }else{
        data = {"isConfirm":"已确认"};
      }
      var qgzx = new DB('swzx_qgzx');
      qgzx.update(req,res,data,'p_id',p_id,1);
    }
  });
}

/*
* 功能：返回学生的勤工助学信息
* @param：学生的学号cardNo
* @return:json
*/
exports.studentInfo = function(req,res){
  var studentNo = req.query.studentNo;
  query('select * from swzx_qgzx where studentNo='+studentNo,function(err,vals,fields){
    if(err){
      console.log(err);
    }else{
      res.jsonp({qgzx:vals});
    }
  });
}


/*
* 功能：将查询出的mysql结果对象解析为可以插入excel的对象
* @param:vals:mysql查询结果对象
@ return:object
*
*/
function mysqltoexcel(vals){
  var data = [['序号','学号','姓名','工作单位','银行卡账号','工作时数','工资金额','是否确认','是否修改','修改的新的账号']];
  var result;
  for(var i=0; i<vals.length; ++i){
    result = [vals[i].p_id,vals[i].studentNo,vals[i].studentName,vals[i].workplaces,vals[i].cardNo,vals[i].workingHours,vals[i].wages,vals[i].isConfirm,vals[i].isChange,vals[i].newCardNo];
    data.push(result);
  }
  return data;
}