module.exports = (sequelize, Sequelize) => {
  const Retailer = sequelize.define("retailers", {
    name: {
      type: Sequelize.STRING
    },
    shopname: {
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
    aadhar: {
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

  return Retailer;
};
