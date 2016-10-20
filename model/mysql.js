var mysql=require("mysql");

var pool = mysql.createPool({  
    host: '127.0.0.1',  
    user: 'root',  
    password: 'root',  
    database: 'swzx',  
    port: '3306'  
}); 

var query=function(sql,callback){
	
	pool.getConnection(function(err,conn){
		if(err){
			callback(err,null,null);
		}else{
			conn.query(sql,function(qerr,vals,fields){
				conn.release();
				return callback(qerr,vals,fields);
			});
		}
	});
};

module.exports=query;