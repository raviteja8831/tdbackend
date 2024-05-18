module.exports = (sequelize, Sequelize) => {
  const retailerFiles = sequelize.define("retailer_files", {
    retailerId: {
      type: Sequelize.INTEGER,
    },
    check: {
      type: Sequelize.STRING
    },
    aadhar: {
      type: Sequelize.STRING
    },  
    gst: {
      type: Sequelize.STRING
    },
    pan: {
      type: Sequelize.STRING
    },
    logo: {
      type: Sequelize.STRING
    }
  });

  return retailerFiles;
};
