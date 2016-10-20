var query = require('./mysql.js');

function DB(tableName){
	this.tableName = tableName;
/*	this.setName = function(tableName){
		this.tableName = tableName;
	}*/
};

DB.prototype.add = function(data){
	var jsonObj = {"55":"1","70":"0","80":"2","60":"2"};  
  
for (var prop in jsonObj)  
{     
     console.log("jsonObj[" + prop + "]=" + jsonObj[prop]);     
}  
	console.log(this.tableName);
};

module.exports = DB;
