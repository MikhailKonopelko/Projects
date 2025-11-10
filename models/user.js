'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(_models) {}
	}
	User.init({
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: { isEmail: true }
		},
		passwordHash: {
			type: DataTypes.STRING,
			allowNull: false
		},
		refreshTokenHash: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'User',
		tableName: 'Users',
		freezeTableName: true
	});
	return User;
};