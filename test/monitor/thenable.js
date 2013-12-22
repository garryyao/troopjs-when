define(["when"], function(when) {

	function f1() {
		return when.promise(function(_, reject) {
			reject(new Error('unhandled-forever'));
		});
	}

	function f2(p) {
		return p.then(function() {
		});
	}

	function f3(p) {
		return p.then(function() {
		});
	}

	f3(f2(f1()));
});
