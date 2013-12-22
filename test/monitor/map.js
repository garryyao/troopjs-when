define(["when"], function(when) {

	var p = when.reject(new Error('fail1'))

	when.map([p], function(x) {
		return x;
	});

});
