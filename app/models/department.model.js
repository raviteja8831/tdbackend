module.exports = (sequelize, Sequelize) => {
  const Department = sequelize.define("departments", {
     name: {
      type: Sequelize.STRING
    },
    companyId: {
      type: Sequelize.STRING
    }
  });

  return Department;
};
