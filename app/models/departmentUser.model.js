module.exports = (sequelize, Sequelize) => {
  const DepartmentUser = sequelize.define("department_users", {
    companyuserId: {
      type: Sequelize.STRING
    },
    departmentId: {
      type: Sequelize.STRING
    }
  });

  return DepartmentUser;
};
