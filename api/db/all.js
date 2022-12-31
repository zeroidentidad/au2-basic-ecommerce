const db = require('./db');

module.exports = async function all(query, placeholders) {
	return new Promise((resolve, reject) => {
		db.all(query, placeholders, (error, rows) => {
			if (error) {
				return reject(error);
			}
			resolve(rows);
		});
	});
};
