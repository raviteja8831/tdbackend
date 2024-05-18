module.exports = (sequelize, Sequelize) => {
  const GroupUser = sequelize.define("group_users", {
    companyuserId: {
      type: Sequelize.STRING
    },
    groupId: {
      type: Sequelize.STRING
    }
  });

  return GroupUser;
};
