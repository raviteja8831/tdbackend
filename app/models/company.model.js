module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define("companies", {
    companyname: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    gst: {
      type: Sequelize.STRING
    },
    mobile: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    gst: {
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
    userType: {
      type: Sequelize.STRING
    }
  });

  return Company;
};
