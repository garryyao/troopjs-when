define(['when'], function(when) {
	when.resolve(123).then(function() {
		return when.promise(function(resolve, reject) {
			reject('foo');
		});
	});
});


