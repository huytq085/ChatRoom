'use strict';
module.exports = function (yard) {
	if (typeof yard !== 'number') {
		throw new TypeError('Expected a number');
	}

	return {
		cm: yard * 91.44,
		in: yard * 36,
		ft: yard * 3
	};
};
