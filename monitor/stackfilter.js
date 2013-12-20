define(["poly/array","poly/string"], function() {
	return function(isExcluded, replace) {
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
				if (match) {
					if (!excluded) {
						excluded = [];
					}
					excluded.push(line);
				} else {
					if (excluded) {
						if (filtered.length > 1) {
							filtered = filtered.concat(replace(excluded));
							excluded = null;
						}
					}
					filtered.push(line);
				}

				return filtered;
			},[]);
		};
	};
});
