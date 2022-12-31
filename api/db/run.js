const db = require('./db');

module.exports = async function run(query, placeholders) {
	return new Promise((resolve, reject) => {
		db.run(query, placeholders, function (error) {
			if (error) {
				return reject(error);
			}
			resolve(this);
		});
	});
};
