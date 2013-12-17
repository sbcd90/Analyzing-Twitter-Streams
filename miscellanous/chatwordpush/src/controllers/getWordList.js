var view = require('../views/preparedWordList');

exports.get = function(){
	var display = view.build();
	return(display[0]);
}