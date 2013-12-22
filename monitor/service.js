define([
	"troopjs-core/component/service",
	'./reporter',
	'./formatter',
	'./stackfilter',
	"when",
	"poly/function"
], function(Service, reporter, formatter, filter, when) {

	return Service.create({
		"displayName": "troopjs-when/monitor/service",
		"sig/start": function() {
			var bridge = typeof console !== 'undefined' ? console : when;
			reporter(this.log.bind(this), formatter).publish(bridge);
		},
		log: function(rej) {
			// Publish the rejection.
			this.publish('promise/rejection', rej);
		}
	});

});
