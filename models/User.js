const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const { DateTime } = require("luxon");

module.exports = sequelize.define("User", {
  id: {
    type: DataTypes.TEXT,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  picture: {
    type: DataTypes.TEXT,
    defaultValue: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1685421850~exp=1685422450~hmac=eb42cbd8af487fbbbd99b365d786a5de743cc58fd7e31cdcfd0367ae97fdcd71",
    validate: {
      isUrl: true,
    },
  },
  status: {
    type: DataTypes.TEXT,
  },
  status_message: {
    type: DataTypes.TEXT,
  },
  group_list: {
    type: DataTypes.TEXT,
    set(value) {
      this.setDataValue('group_list', value.join(","));
    },
    get() {
      return this.getDataValue("group_list").split(",");
    },
  },
  groups: {
    type: DataTypes.TEXT,
    set(value) {
      this.setDataValue('groups', JSON.stringify(value));
    },
    get() {
      return JSON.parse(this.getDataValue("groups"));
    },
  },
  active: {
    type: DataTypes.TINYINT(1),
  },
  token: {
    type: DataTypes.TEXT,
  },
  last_active: {
    type: DataTypes.TEXT,
    get() {
      return DateTime.fromISO(this.getDataValue("last_active"));
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
