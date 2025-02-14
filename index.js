const express = require("express");
const app = express();
const {User, Habit} = require("./db");
const bcrypt = require("bcrypt");
const seed = require("./db/seedFn");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res, next) => {
	try {
		res.send(
			"<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
		);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

app.get("/seed", async (req, res, next) => {
	try {
		await seed();
		res.status(200).send("working yeah");
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const hashed = await bcrypt.hash(password, 10);

		const newUser = await User.create({username: username, password: hashed});

		res.status(200).send(`successfully created user ${newUser.username}`);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post("/login", async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const foundUser = await User.findOne({where: {username: username}});

		if (foundUser) {
			const correctPassword = await bcrypt.compare(password, foundUser.password);
			if (correctPassword)
				res.status(200).send(`successfully logged in user ${foundUser.username}`);
			else res.status(200).send("incorrect username or password");
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//EXTENSION: /me endpoint to return all associated habits
app.get("/me", async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const foundUser = await User.findOne({
			where: {username: username},
			include: {model: Habit, as: "habits"},
		});

		if (foundUser) {
			const correctPassword = await bcrypt.compare(password, foundUser.password);
			if (correctPassword) {
				res.status(200).send({
					message: `successfully found ${foundUser.habits.length} habit for user ${foundUser.username}`,
					habits: foundUser.habits,
				});
			} else res.status(200).send("incorrect username or password");
		}
	} catch (error) {}
});
// we export the app, not listening in here, so that we can run tests
module.exports = app;
