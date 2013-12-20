define(function() {
	'use strict';

	var hasStackTraces;

	try {
		throw new Error();
	}
	catch (e) {
		hasStackTraces = !!e.stack;
	}

	return function(filterStack, unhandledMsg, stackJumpMsg) {
		return function format(rec) {
			var cause, formatted;

			formatted = {
				reason: rec.reason,
				message: rec.reason && rec.reason.toString()
			};

			if (hasStackTraces) {
				cause = rec.reason && rec.reason.stack;
				if (!cause) {
					cause = rec.rejectedAt && rec.rejectedAt.stack;
				}
				var jumps = formatStackJumps(rec);
				formatted.stack = stitch(rec.createdAt.stack, jumps, cause);
			}

			return formatted;
		};

		function formatStackJumps(rec) {
			var jumps = [];

			rec = rec.parent;
			while ( rec ) {
				jumps.push(formatStackJump(rec));
				rec = rec.parent;
			}

			return jumps;
		}

		function formatStackJump(rec) {
			return filterStack(toArray(rec.createdAt.stack).slice(1));
		}

		function stitch(escaped, jumps, rejected) {
			rejected = filterStack(toArray(rejected));
			return jumps.reduce(function(stack, jump, i) {
				return i ? stack.concat(stackJumpMsg, jump) : stack.concat(jump);
			}, [unhandledMsg].concat(rejected));
		}

		function toArray(stack) {
			return stack ? stack.split('\n') : [];
		}
	};

});
