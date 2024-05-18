module.exports = (sequelize, Sequelize) => {
    const companyFiles = sequelize.define("company_files", {
      companyId: {
        type: Sequelize.INTEGER,
      },
      logo: {
        type: Sequelize.STRING
      }
    });
  
    return companyFiles;
  };
  