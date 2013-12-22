define(["when"], function(when) {
	var i = 1;
	var p = when.promise(function(_, reject) {
		setTimeout(reject.bind(null, new Error(i++)), 1);
	});

	var p = when.promise(function(_, reject) {
		setTimeout(reject.bind(null, new Error(i++)), 1);
	});

	var p = when.promise(function(_, reject) {
		setTimeout(reject.bind(null, new Error(i++)), 1);
	});

});
