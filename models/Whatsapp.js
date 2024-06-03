const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid'); 

module.exports = sequelize.define("Whatsapp", {
  id: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false,
    defaultValue: uuidv4(),
  },
  name: {
    type: DataTypes.TEXT,
  },
  session: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  connected: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
    get() {
      return Boolean(this.getDataValue("connected"));
    },
  },
  created_at: {
    type: DataTypes.TEXT,
    defaultValue: DateTime.now().toISO(),
    get() {
      return DateTime.fromISO(this.getDataValue("created_at"));
    },
  },
  updated_at: {
    type: DataTypes.TEXT,
    defaultValue: DateTime.now().toISO(),
    get() {
      return DateTime.fromISO(this.getDataValue("updated_at"));
    },
  },
  deleted_at: {
    type: DataTypes.TEXT,
    get() {
      return DateTime.fromISO(this.getDataValue("deleted_at"));
    },
  },
});
