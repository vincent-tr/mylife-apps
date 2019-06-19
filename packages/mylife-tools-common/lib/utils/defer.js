'use strict';

exports.defer = () {

	const result = {
		resolve: null,
		reject: null
	};

	result.promise = new Promise((resolve, reject) => {
		result.resolve = resolve;
		result.reject = reject;
	});

	return result;
};
