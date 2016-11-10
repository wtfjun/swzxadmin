var query = require('./mysql.js');
var Eventproxy = require('eventproxy');  



exports.getClass = function(){
	var resultClass;
	query("select * from swzx_smallclass", function(err,vals){
		if(err){
			console.log(err);
		}else{				
			resultClass = vals;
			return vals;
		}
	});
	console.log(resultClass);
	return resultClass;
}
