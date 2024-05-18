module.exports = (sequelize, Sequelize) => {
    const PO = sequelize.define("quotation_po", {
     
      quotationId: {
        type: Sequelize.INTEGER
      },
      po_no: {
        type: Sequelize.INTEGER
      },
     gross_amount:{
      type: Sequelize.INTEGER
     },
     createdAt:{
      type: Sequelize.STRING
     }
    });
  
    return PO;
  };