const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.group = require("../models/group.model.js")(sequelize, Sequelize);
db.department = require("../models/department.model.js")(sequelize, Sequelize);

db.groupUser = require("../models/groupUser.model.js")(sequelize, Sequelize);
db.departmentUser = require("../models/departmentUser.model.js")(sequelize, Sequelize);
db.quotationDepartmentStatus = require("../models/quotationDepartmentStatus.model.js")(sequelize, Sequelize);

db.companyFiles = require("../models/company_images.model.js")(sequelize, Sequelize);
db.company = require("../models/company.model.js")(sequelize, Sequelize);
db.retailer = require("../models/retailer.model.js")(sequelize, Sequelize);
 db.rquotation = require("../models/retailer_quotations.model.js")(sequelize, Sequelize);
 db.qhistory = require("../models/quotation_history.model.js")(sequelize, Sequelize);
 db.orders = require("../models/orders.model.js")(sequelize, Sequelize);
 db.Qorders = require("../models/quotation_orders.model.js")(sequelize, Sequelize);
 db.companyUser = require("../models/companyUser.model.js")(sequelize, Sequelize);
 db.POorders = require("../models/po_orders.model.js")(sequelize, Sequelize);
 db.retailerImages = require("../models/retailer_images.model.js")(sequelize, Sequelize);
 db.orderImages = require("../models/order_images.model.js")(sequelize, Sequelize);
 db.groupUser = require("../models/groupUser.model.js")(sequelize, Sequelize);


console.log(db.company,"company")
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});
db.group.belongsToMany(db.companyUser, {
  through: "group_users"
});
db.companyUser.belongsToMany(db.group, {
  through: "group_users"
});
db.department.belongsToMany(db.companyUser, {
  through: "department_users"
});
db.companyUser.belongsToMany(db.department, {
  through: "department_users"
});
db.rquotation.hasMany(db.orders);
db.rquotation.hasMany(db.qhistory);

db.retailer.hasMany(db.rquotation);
db.company.hasMany(db.rquotation);
db.company.hasMany(db.companyUser);
db.retailer.hasOne(db.retailerImages);

db.retailerImages.belongsTo(db.retailer,{
  foreignKey: 'retailerId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.companyUser.hasOne(db.quotationDepartmentStatus);

db.quotationDepartmentStatus.belongsTo(db.companyUser,{
  foreignKey: 'companyuserId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.department.hasOne(db.quotationDepartmentStatus);

db.quotationDepartmentStatus.belongsTo(db.department,{
  foreignKey: 'departmentId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.company.hasOne(db.companyFiles);

db.companyFiles.belongsTo(db.company,{
  foreignKey: 'companyId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.orders.belongsTo(db.rquotation,{
  foreignKey: 'retailerQuotationId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.qhistory.belongsTo(db.rquotation,{
  foreignKey: 'retailerQuotationId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.rquotation.belongsTo(db.retailer,{
  foreignKey: 'retailerId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.rquotation.belongsTo(db.company,{
  foreignKey: 'companyId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
db.companyUser.belongsTo(db.company,{
  foreignKey: 'companyId', // Specify the foreign key column name
  foreignKeyConstraint: true
});
// db.rquotation.belongsTo(db.company,{
//   foreignKey: 'companydetails', // Specify the foreign key column name
// })

// db.retailer.belongsToMany(db.orders, {
//   through: "shop_id"
// });
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
