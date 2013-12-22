define(['when'], function(when) {
	when.resolve([123])
		.spread(function(x) {
			return x + 1;
		}).then(function(x) {
			throw new Error(x);
		});
});


