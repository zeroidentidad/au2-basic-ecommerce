const db = require('./db');

module.exports = async function get(query, placeholders) {
	return new Promise((resolve, reject) => {
		db.get(query, placeholders, (error, row) => {
			if (error) {
				return reject(error);
			}
			return resolve(row);
		});
	});
};
