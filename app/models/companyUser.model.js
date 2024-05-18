module.exports = (sequelize, Sequelize) => {
  const CompanyUser = sequelize.define("companyuser", {
    mobile: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    aadhar: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    roleId: {
      type: Sequelize.INTEGER
    },
    companyId: {
      type: Sequelize.INTEGER
    },
    userType: {
      type: Sequelize.STRING
    }
  });

  return CompanyUser;
};
