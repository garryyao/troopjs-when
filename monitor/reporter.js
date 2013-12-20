define(function() {

	'use strict';

	return function createReporter(logger, formatter) {
		var nextKey;

		function PromiseStatus(parent) {
			if (!(this instanceof PromiseStatus)) {
				return new PromiseStatus(parent);
			}

			var stackHolder;

			try {
				throw new Error();
			}
			catch (e) {
				stackHolder = e;
			}

			this.key = nextKey++;
			this.parent = parent;
			this.timestamp = +(new Date());
			this.createdAt = stackHolder;
		}

		var emptyFn = function() {};

		PromiseStatus.prototype = {
			observed: function() {
				// Create a new promise tracing the parent promise.
				var status = new PromiseStatus(this);
				// Dismiss the previous status tracing once we start to trace the new promise.
				this.rejected = this.observed = emptyFn;
				return status;
			},
			rejected: function(reason) {
				var stackHolder;
				try {
					throw new Error(reason && reason.message || reason);
				}
				catch (e) {
					stackHolder = e;
				}

				this.reason = reason;
				this.rejectedAt = stackHolder;

				// Log any rejection.
				logger(formatter(this));
			},
			fulfilled: emptyFn
		};

		reset();

		return publish({ publish: publish });

		function publish(target) {
			target.PromiseStatus = PromiseStatus;
			return target;
		}

		function reset() {
			nextKey = 0;
		}
	};
});
