module.exports = (sequelize, Sequelize) => {
  const Qorders = sequelize.define("quotation_orders", {
     orderId: {
      type: Sequelize.INTEGER
    },
    quotationId: {
      type: Sequelize.INTEGER
    }
  });

  return Qorders;
};
