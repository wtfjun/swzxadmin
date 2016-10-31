var query = require('./mysql.js');
//基类DB
function DB(tableName){
	this.tableName = tableName;
/*	this.setName = function(tableName){
		this.tableName = tableName;
	}*/
};


/*
*	该方法为往表里加入数据
*	@param data:json,api:int
*	data中的json：key为字段名,value为字段值
*	api为判断是否是接口调用
*/
DB.prototype.add = function(req,res,data,api){
	var fiedls = [];
	var value = [];
	for (var key in data)  
	{     
	    fiedls.push(key);
	    value.push(data[key]);
	}  
	//console.log("key:"+key);
	//console.log("data:"+data);
	//取出字段名
	var sql = "insert into "+this.tableName+"(";
	var i;
	for(i=0; i<fiedls.length-1; i++){
		sql = sql + fiedls[i] +  ",";
	}
	sql = sql +  fiedls[i] +  ") values(";
	//取出字段名对应的值
	for(i=0; i<value.length-1; i++){
		sql = sql + "'" + value[i] + "'" + ",";
	}
	sql = sql + "'" + value[i] + "'" + ")";
	console.log("sql:"+sql);
	query(sql,function(err,vals,fiedls){
		if(err){
			console.log(err);
			/*res.setHeader('Content-Type', 'text/html');
			res.json({status:0});*/
		}else{
			//res.setHeader('Content-Type', 'text/html');
			//res.json({status:1});
			if(typeof(api)=='undefined'){
				res.redirect('/welcome');
			} 
			else{
				res.jsonp({status:1});
			}
		}
	});
}
/*
*	功能：删除某个表中的某条记录
*	@param:data，json数据，包含该表的主键名称以及需要删除的主键的值
*/
DB.prototype.del = function(req,res,data){
	var fiedls = [];
	var value = [];
	for (var key in data)  
	{     
	    fiedls.push(key);
	    value.push(data[key]);
	}  
	var sql = "delete from " + this.tableName + " where "+ fiedls[0] + "=" + value[0];
	console.log(sql); 
	query(sql,function(err,vals,fields){
		if(err){
			console.log(err);
			res.json({status:0});
		}else{
			res.json({status:1});
		}
	});
}	
/*
*	功能:更新某个表的数据
* 	@param:data:需要更新的数据的字段和值，为json数据
*	@param:fiedlsid:该表的主键
*	@param:id:主键的值
*	@param:api:是否为前台API调用
*/
DB.prototype.update = function(req,res,data,fiedlsid,id,api){
	var fiedls = [];
	var value = [];
	for (var key in data)  
	{     
	    fiedls.push(key);
	    value.push(data[key]);
	} 
	var sql = "update " + this.tableName + " set ";
	var i;
	for(i=0; i<fiedls.length-1; ++i){
		sql = sql + fiedls[i] + "='" + value[i] + "',";
	}
	sql = sql + fiedls[i] + "='" + value[i] + "' where " + fiedlsid + "=" + id;
	console.log(sql);
	query(sql,function(err,vals,fiedls){
		if(err){
			console.log(err);
		}else{
			//console.log('更新成功');
			if(typeof(api)=='undefined'){
				res.redirect('/welcome');
			}else{
				res.jsonp({status:1});
			}
		}
	});
}

module.exports = DB;
