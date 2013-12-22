define(["poly/array", "poly/string"], function() {
	return function(isExcluded, replacer) {
		return function filterStack(stack) {
			var excluded;

			if (!(stack && stack.length)) {
				return [];
			}

			excluded = [];

			return stack.reduce(function(filtered, line) {
				var match;

				// Trim left whitespaces.
				line = line.trimLeft();

				match = isExcluded(line);
				if (!match) {
					if (excluded && excluded.length && filtered.length) {
						var substitution = typeof replacer == 'function' ? replacer(excluded) : replacer;
						filtered = filtered.concat(substitution);
						excluded = null;
					}
					filtered.push(line);
				} else if (replacer) {
						if (!excluded) {
							excluded = [];
						}
						excluded.push(line);
					}

				return filtered;
			}, []);
		};
	};
});
