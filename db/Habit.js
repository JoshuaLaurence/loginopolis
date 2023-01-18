const {Sequelize, sequelize} = require("./db");

const Habit = sequelize.define("habit", {
	name: Sequelize.STRING,
	isGood: Sequelize.BOOLEAN,
});

module.exports = {Habit};
