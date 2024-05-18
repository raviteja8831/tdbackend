//   `created_at` datetime DEFAULT NULL,
//   `updated_at` datetime DEFAULT NULL,
//   `shop_id` in
module.exports = (sequelize, Sequelize) => {
    const orders = sequelize.define("orders", {
      specification: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      gst_perc: {
        type: Sequelize.STRING
      },
      gst_dropdown: {
        type: Sequelize.STRING
      },
      cgst: {
        type: Sequelize.STRING
      },
      sgst: {
        type: Sequelize.STRING
      },
      gross_amount: {
        type: Sequelize.STRING
      },
      units: {
        type: Sequelize.STRING
      },
      unitsrate: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.STRING
      },
      retailerQuotationId: {
        type: Sequelize.INTEGER
      },
    });
  
    return orders;
  };
  