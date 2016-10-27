var query = require('./mysql.js');
//基类DB
function DB(tableName){
	this.tableName = tableName;
/*	this.setName = function(tableName){
		this.tableName = tableName;
	}*/
};


/*
*	data:json数据;
*	{key:var,value:var}
*	key为字段名，value为字段名对应的值
*/
DB.prototype.add = function(req,res,data){ 
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
			
			res.redirect('/welcome');
		}
	});
}

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

DB.prototype.update = function(req,res,data,fiedlsid,id){
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
			console.log('更新成功');
			res.redirect('/welcome');
		}
	});
}

module.exports = DB;
