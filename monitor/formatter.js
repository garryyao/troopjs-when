define(['./stackfilter'], function(stackfilter) {

	var hasStackTraces;

	try {
		throw new Error();
	}
	catch (e) {
		hasStackTraces = !!e.stack;
	}

	var filename_exclude_regexp = /(when|aggregator)\.js/;
	var funcname_exclude_regexp = /\.PromiseStatus|Promise\./;
	function filterLine(line) {
		return filename_exclude_regexp.exec(line) || funcname_exclude_regexp.exec(line);
	}
	function filterStackLine() {
		return false;
	}

	var rejections_stack_header = '=== Rejection promise stack ===';
	var cause_stack_header = '=== Rejection cause stack ===';

	var rejectionsStackFilter = stackfilter(filterLine);
	var causeStackFilter = stackfilter(filterStackLine, '...');

	// Format all promise rejections in a stack.
	function formatRejectionStack(rej) {
		var promises = [], line;

		while ( rej ) {
			line = formatRejection(rej);
			line && promises.push(line);
			rej = rej.parent;
		}

		return promises;
	}

	// Filtering out stack lines from when internal, leaving only the line where the thenable is created.
	function formatRejection(rej) {
		var stack = lines(rej.createdAt.stack).slice(1);
		stack = rejectionsStackFilter(stack);
		return stack.length? stack[0] : null;
	}

	function stitch(rejectionCause, rejectionStack) {
		return [rejections_stack_header]
						 .concat(rejectionStack)
						 .concat([cause_stack_header])
						 .concat(rejectionCause).join('\n');
	}

	function lines(stack) {
		return stack ? stack.split('\n') : [];
	}

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
			formatted.stack = stitch(causeStackFilter(lines(cause)), formatRejectionStack(rec));
		}

		return formatted;
	};


});
