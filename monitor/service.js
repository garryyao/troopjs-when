define([
	"module",
	"troopjs-core/component/service",
	"when",
	'when/monitor/aggregator',
	'when/monitor/throttledReporter',
	'when/monitor/simpleFormatter',
	'when/monitor/logger/consoleGroup',
	"poly/function"
], function(module, Service, when, createAggregator, throttleReporter, simpleFormatter, logger) {

	var cfg = module.config();
    var promiseFilters = cfg["promiseFilter"] || [
        /when\.js|(module|node)\.js:\d|when\//i,
        /\b(PromiseStatus|Promise)\b/i,
        /jquery(?:-[\d.]+)\.js/,
        /require\.js/i,
        /troopjs-/i
    ];

    var errorFilters = cfg["errorFilter"] || [
        /(when|keys|aggregator|reporter)\.js/
    ];

    return Service.create({
		"displayName": "troopjs-when/monitor/service",
		"sig/start": function() {
			var formatter = simpleFormatter({filter: promiseFilters}, {filter: errorFilters, replacer: '...'});
			var aggregator = createAggregator(throttleReporter(formatter, logger));

			var bridge = typeof console !== 'undefined' ? console : when;
			aggregator.publish(bridge);
			return aggregator;
		},
		log: function(rej) {
			// Publish the rejection.
			this.publish('promise/rejection', rej);
		}
	});

});
