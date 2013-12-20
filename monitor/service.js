define([
	"troopjs-core/component/service",
	'./reporter',
	'./formatter',
	'./stackfilter',
	"when",
	"poly/function"
], function(Service, reporter, formatter, filter, when) {

	var rejectionMsg = '=== Unhandled promise rejection ===',
		stackJumpMsg = '---',
		excludeRx = /when\.js|(module|node)\.js:\d|when\/\w+|PromiseStatus/i;

	function onExcluded(/* excluded */) {
		return '...';
	}

	function exclude(line) {
		return excludeRx.test(line);
	}

	return Service.create({
		"displayName": "troopjs-when/monitor/service",
		"sig/start": function() {
			var target = typeof console !== 'undefined' ? console : when;
			var logger = this.log.bind(this);
			formatter = formatter(
				filter(exclude, onExcluded),
				rejectionMsg,
				stackJumpMsg
			);
			reporter(logger, formatter).publish(target);
		},
		log: function(rej) {
			// Join stack lines.
			rej.stack = rej.stack.join('\n');
			// Publish the rejection.
			this.publish('promise/rejection', rej);
		}
	});

});
