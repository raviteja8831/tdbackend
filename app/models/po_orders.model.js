//   `created_at` datetime DEFAULT NULL,
//   `updated_at` datetime DEFAULT NULL,
//   `shop_id` in
module.exports = (sequelize, Sequelize) => {
    const po_orders = sequelize.define("po_orders", {
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
      retailerQuotationId: {
        type: Sequelize.INTEGER
      },
      retailerQuotationId: {
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER
      },
    });
  
    return po_orders;
  };
  