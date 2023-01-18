const {User} = require("./User");
const {Habit} = require("./Habit");
const {sequelize, Sequelize} = require("./db");

Habit.belongsTo(User);
User.hasMany(Habit);

module.exports = {
	User,
	Habit,
	sequelize,
	Sequelize,
};
