module.exports = (sequelize, Sequelize) => {
    const Billing = sequelize.define("quotation_billing", {
     
      quotationId: {
        type: Sequelize.INTEGER
      },
      billing_no: {
        type: Sequelize.INTEGER
      },
     gross_amount:{
      type: Sequelize.INTEGER
     },
     createdAt:{
      type: Sequelize.STRING
     }
    });
  
    return Billing;
  };