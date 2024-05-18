module.exports = (sequelize, Sequelize) => {
  const QuotationDepartmentStatus = sequelize.define("quotation_department_statuses", {
    companyuserId: {
      type: Sequelize.INTEGER
    },
    retailerQuotationId: {
      type: Sequelize.INTEGER
    },
    departmentId: {
      type: Sequelize.INTEGER
    },
    comments: {
      type: Sequelize.STRING
    }
  });

  return QuotationDepartmentStatus;
};
