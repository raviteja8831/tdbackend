module.exports = (sequelize, Sequelize) => {
    const Qorders = sequelize.define("quotation_histories", {
       status: {
        type: Sequelize.STRING
      },
      retailerQuotationId: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      user_type: {
        type: Sequelize.STRING
      },
      bill_amount: {
        type: Sequelize.STRING
      },
      po_amount: {
        type: Sequelize.STRING
      },
      quot_amount: {
        type: Sequelize.STRING
      },
      bill_no: {
        type: Sequelize.STRING
      },
      po_no: {
        type: Sequelize.STRING
      },
      quot_no: {
        type: Sequelize.STRING
      },
      po_file: {
        type: Sequelize.STRING
      },
      bill_file: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      quot_file: {
        type: Sequelize.STRING
      },
      file_type:{
        type:Sequelize.STRING
      }
    });
  
    return Qorders;
  };
  