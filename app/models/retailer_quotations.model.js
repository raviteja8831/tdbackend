module.exports = (sequelize, Sequelize) => {
    const RQuotation = sequelize.define("retailer_quotations", {
     
      retailerId: {
        type: Sequelize.INTEGER
      },
      quotation_no: {
        type: Sequelize.INTEGER
      },
      po_no: {
        type: Sequelize.INTEGER
      },
      billing_no: {
        type: Sequelize.INTEGER
      },
      companyId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      quot_type: {
        type: Sequelize.STRING
      },
      groupId: {
        type: Sequelize.INTEGER
      },
      comments: {
        type: Sequelize.STRING
      },
    });
  
    return RQuotation;
  };