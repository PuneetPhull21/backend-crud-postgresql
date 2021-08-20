const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const details = {
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    verified:{type:DataTypes.DATE},
    verifiedToken:{type:DataTypes.STRING},
    isVerified:{type:DataTypes.VIRTUAL,get(){return !!(this.verified)}}
  };
  return sequelize.define("details", details);
}
