const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const all = require('./db/all');
const get = require('./db/get');
const run = require('./db/run');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = process.env.PORT || '3002';
const log = require('./log');
app.listen(port, () => {
    log(`Listening to requests on http://localhost:${port}`);
});

app.get('/', (_req, res) => {
    log(`[GET]/`);
	res.status(200).send('The server is working');
});

app.get('/products', async (_req, res) => {
    log(`[GET]/products`);
	const rows = await all('SELECT * FROM products', []);
	res.json(rows);
});

app.get('/product/:id', async (req, res) => {
    log(`[GET]/product/${req.params['id']}`);
	const row = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
	res.json(row);
});

app.put('/product/:id', async (req, res) => {
    log(`[PUT]/product/${req.params['id']}`);
	await run(`UPDATE products SET title=?, price=?, description=? WHERE id = ?`, [
		`${req.body.title}`,
		`${req.body.price}`,
		`${req.body.description}`,
		`${req.params['id']}`,
	]);
	res.json({ success: true });
});

app.post('/search', async (req, res) => {
    log(`[POST]/search${req.body.query}`);
	const query = req.body.query;
	const rows = await all('SELECT * FROM products WHERE title LIKE ?', [`%${query}%`]);
	res.json(rows);
});

app.post('/orders', async (req, res) => {
	log(`[POST]/orders`);
	const userId = req.body.userId;
	const rows = await all('SELECT * FROM orders WHERE userId=?', [userId]);
	res.json(rows);
});

app.post('/order', async (req, res) => {
	log(`[POST]/order`);
	const row = await get('SELECT * FROM orders WHERE userId=? AND id=?', [req.body.userId, req.body.orderId]);
	row.quantity = parseInt(row.quantity);
	res.json(row);
});

app.post('/register', async (req, res) => {
    log(`[POST]/register`);
	const username = req.body.username;
	const password = req.body.password;
	const userExists = await get('SELECT username FROM users WHERE username = ?', [username]);

	if (!userExists) {
		const insert = await run(`INSERT INTO users (username, password) VALUES('${username}', '${password}')`, []);
		if (insert) {
			res.json({ username, success: true });
		}
	} else {
		res.json({ success: false, message: 'User already registered' });
	}
});

app.post('/processOrder', async (req, res) => {
    log(`[POST]/processOrder`);
	const userId = parseInt(req.body.userId);
	const fields = req.body.checkoutFields;
	const cart = req.body.cart;

	// only save the last 4 digits
	fields.ccNumber = fields.ccNumber.toString().substr(-4);

	const total = cart
		.reduce((runningTotal, product) => {
			const total = parseInt(product.quantity) * product.price;
			return runningTotal + total;
		}, 0)
		.toFixed(2);

	const insert = await run(
		`INSERT INTO orders (cart, total, userId, firstName, lastName, email, address, address2, country, state, zip, paymentType, ccName, ccNumber, date) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			`${JSON.stringify(cart)}`,
			`${total}`,
			`${userId}`,
			`${fields.firstName}`,
			`${fields.lastName}`,
			`${fields.email}`,
			`${fields.address}`,
			`${fields.address2}`,
			`${fields.country}`,
			`${fields.state}`,
			`${fields.zip}`,
			`${fields.paymentType}`,
			`${fields.ccName}`,
			`${fields.ccNumber}`,
			`${new Date()}`,
		]
	);

	res.json({ orderId: insert.lastID, success: true });
});

app.post('/user', async (req, res) => {
    log(`[POST]/user`);
	const username = req.body.username;
	const password = req.body.password;
	const user = await get('SELECT id, username FROM users WHERE username = ? AND password = ?', [username, password]);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(401).send(null);
	}
});
