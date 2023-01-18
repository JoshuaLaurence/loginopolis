const {sequelize} = require("./db");
const {User} = require("./");
const {Habit} = require("./");
const users = require("./seedData");
const habits = require("./seedHabits.json");
const bcrypt = require("bcrypt");

const seed = async () => {
	await sequelize.sync({force: true}); // recreate db
	const unresolvedPromises = users.map(async (element) => {
		const hashedPassword = await bcrypt.hash(element.password, 10);
		return {username: element.username, password: hashedPassword};
	});

	const results = await Promise.all(unresolvedPromises);

	for (let i = 0; i < results.length; i++) {
		const newUser = await User.create(results[i]);
		const newHabit = await Habit.create(habits[i]);
		console.log(newHabit, newUser);
		await newUser.addHabit(newHabit);
	}
};

module.exports = seed;
