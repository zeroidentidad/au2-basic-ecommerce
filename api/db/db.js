const sqlite = require('sqlite3');
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database('./db/webstore.db');
module.exports = db;