module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("groups", {
     name: {
      type: Sequelize.STRING
    },
    companyId: {
      type: Sequelize.STRING
    }
  });

  return Group;
};
