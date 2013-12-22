define(["when"], function(when) {

	var p = when.resolve(123);

	p.then(function() {
		oops();
	});

	function infiniteRecursion() {
		infiniteRecursion();
	}

	p.then(infiniteRecursion);

	var notAFunction = {};

	function tryToCallNotAFunction() {
		notAFunction();
	}

	p.then(tryToCallNotAFunction);
});
