var query = require('../model/mysql.js');
var DB = require('../model/baseModel.js');
var multiparty = require('multiparty');
var fs = require('fs');
var xlsx = require("node-xlsx");

/*
* 功能：取出数据库中勤工助学的信息
*
*/
exports.qglist = function(req,res){
  var sql = "select * from swzx_qgzx";
  query(sql,function(err,vals,fields){
    if(err){
      console.log(err);
    }else{
      res.render('qg',{
        title:'勤工信息',
        qg_list : vals
      })
    }
  })
}


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
                //console.log(err);
              }else{
                //console.log('xlxs导入成功');
                //res.json({status:1});
                res.redirect('/qg');
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
  var data;//json数据，要修改的字段以及值
  if(typeof(p_id)=='undefined'){
    res.jsonp({status:0});
  }
  data = {"isConfirm":"已确认"};
     
  var qgzx = new DB('swzx_qgzx');
  qgzx.update(req,res,data,'p_id',p_id,1);
   
}
/*
* 功能:修改卡号
*/
exports.changeCardNo = function(req,res){
 /* var p_id = req.query.id;//id值
  var cardNo = req.query.card;//卡号

  var data;//json数据，要修改的字段以及值
  data = {"isChange":"已修改","newCardNo":cardNo};
  var qgzx = new DB('swzx_qgzx');
  qgzx.update(req,res,data,'p_id',p_id,1);
*/
var p_id = req.query.id;//id值
  var cardNo = decrypt(req.query.card);//卡号
  var studentNo = decrypt(req.query.studentno);
  var sql = 'select p_id from swzx_qgzx where p_id='+p_id+' and studentNo='+studentNo;
  //console.log(sql);
  query(sql,function(err,vals,fields){
    if(err){
      console.log(err);
    }else{
      if(isEmptyObject(vals)){
        res.jsonp({error:404});
      }else{
         var data;//json数据，要修改的字段以及值
	//console.log(1);
         data = {"isChange":"已修改","newCardNo":cardNo};
         var qgzx = new DB('swzx_qgzx');
         qgzx.update(req,res,data,'p_id',p_id,1);
      }
    }
  });
}

/*
* 功能：返回学生的勤工助学信息
* @param：学生的学号cardNo
* @return:json
*/
exports.studentInfo = function(req,res){
  var studentNo = decrypt(req.query.studentNo);
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

function isEmptyObject(O){
  for (var x in O){
    return false;
  }
  return true;
}

function decrypt(str) {
  var pwd= 'cnmdzssk';
  if(str == null || str.length < 8) {
    return;
  }

  var prand = "";
  for(var i=0; i<pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString();
  }
  var sPos = Math.floor(prand.length / 5);
  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
  var incr = Math.round(pwd.length / 2);
  var modu = Math.pow(2, 31) - 1;
  var salt = parseInt(str.substring(str.length - 8, str.length), 16);
  str = str.substring(0, str.length - 8);
  prand += salt;
  while(prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  var enc_chr = "";
  var enc_str = "";
  for(var i=0; i<str.length; i+=2) {
    enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
    enc_str += String.fromCharCode(enc_chr);
    prand = (mult * prand + incr) % modu;
  }
  return enc_str;
}
