module.exports = (sequelize, Sequelize) => {
  const orderFiles = sequelize.define("order_files", {
    quotationId: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING
    },
    file: {
      type: Sequelize.STRING
    }
   
  });

  return orderFiles;
};
