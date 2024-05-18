const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const RUcontroller = require("../controllers/retailer.controller");
const CUcontroller = require("../controllers/company.controller");
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post("/api/retailuser/addquotation", RUcontroller.addQuotation );
  app.post("/api/company/updateQorders", CUcontroller.updateQorders );

  app.get("/api/company/getAll", CUcontroller.getAll );
  app.get("/api/retailer/getAll", RUcontroller.getAll );

  app.get("/api/retailer/:shopid/quotations", RUcontroller.getQuotations );
  app.get("/api/company/:companyid/:userType/:userId/quotations", CUcontroller.getQuotations );
  app.get("/api/company/:companyid/:userType/:userId/:billNo/quotation", CUcontroller.getQuotationByBill );

  app.get("/api/retailer/:shopid/clearedquotations", RUcontroller.getClearedQuotations );
  app.get("/api/retailer/:shopid/rejectedquotations", RUcontroller.getRejectedQuotations );
  app.get("/api/company/:companyid/:userType/:userId/billquotations", CUcontroller.getBillQuotations );

  app.get("/api/company/:companyid/:userType/:userId/clearedquotations", CUcontroller.getclearedQuotations );
  app.post("/api/retailerImages", upload.fields([{ name: 'panImage' },{ name: 'AadharImage' }, { name: 'checkImage' }, { name: 'gstImage' }, { name: 'logoImage' },  { name: 'retailerId' }]), controller.uploadRetailerImages);
   // app.post("/api/retailerImages",  controller.uploadRetailerImages );
  app.post("/api/orderImages",    upload.fields([{ name: 'quotId' },{ name: 'name' }, { name: 'file' }]), controller.uploadImage);
  // app.post("/api/retailerImages",  controller.uploadRetailerImages );
  app.post("/api/companyImages", upload.fields([{ name: 'logoImage' },  { name: 'companyId' }]), CUcontroller.uploadCompanyImages);
  app.post("/api/retailer/passwordupdate", RUcontroller.changePassword );
  app.post("/api/user/passwordupdate", CUcontroller.changePassword );
  app.post("/api/company/updateQstatus", CUcontroller.quotationStatusUpdate );
  app.post("/api/company/checkcompanyusername", CUcontroller.checkCompanyUserName );
  app.post("/api/company/checkusername", CUcontroller.checkUserName );
  app.post("/api/retailer/checkusername", RUcontroller.checkUserName );
  app.get("/api/retailer/:retailerId/getImages", RUcontroller.getRetailerImages );

  app.get("/api/company/:companyId/getImages", CUcontroller.getCompanyImages );

  app.post("/api/company/addUser", CUcontroller.addUser );
  app.post("/api/company/addGroup", CUcontroller.addGroup );
  app.post("/api/company/addDepartment", CUcontroller.addDepartment );
  app.post("/api/company/saveDeparmentStatus", CUcontroller.saveQuotationDepartmentStatus );
  app.get("/api/company/getDepartmentsStatus/:quotid", CUcontroller.getQuotationDepartments );

  app.get("/api/retailer/:retailerId/getQuotationsCountByRetailerId", RUcontroller.getQuotationsCountByRetailerId );

  app.post("/api/company/addUsersToGroup", CUcontroller.addUsersToGroup );
  app.post("/api/company/addUsersToDepartment", CUcontroller.addUsersToDepartment );

  app.post("/api/company/savePOOrders", CUcontroller.savePOOrders );
  app.get("/api/company/:quotid/POOrders", CUcontroller.getPOOrders );
  app.get("/api/company/:companyId/getUsers", CUcontroller.getUsers );
  app.get("/api/company/:companyId/getGroups", CUcontroller.getGroups );
  app.get("/api/company/:companyId/getDepartments", CUcontroller.getDepartments );

  app.post("/api/company/uploadPO",    upload.fields([{ name: 'po_no' },{ name: 'po_amount' }, { name: 'retailerQuotationId' },{ name: 'po_file' }]), CUcontroller.uploadPO);
  app.post("/api/company/uploadBill",    upload.fields([{ name: 'bill_no' },{ name: 'bill_amount' }, { name: 'retailerQuotationId' },{ name: 'bill_file' }]), CUcontroller.uploadBill);
  app.post("/api/retailer/createInstantQuotation",    upload.fields([{ name: 'quot_no' },{ name: 'quot_amount' }, { name: 'companyId' },{ name: 'quot_file' },{ name: 'retailerId' },{ name: 'comments' },{ name: 'groupId' }]), RUcontroller.createInstantQuotation);
  app.post("/api/retailer/createInstantBill",    upload.fields([{ name: 'quot_no' },{ name: 'bill_no' },{ name: 'quot_amount' }, { name: 'companyId' },{ name: 'quot_file' },{ name: 'retailerId' },{ name: 'comments' },{ name: 'groupId' }]), RUcontroller.createInstantBill);
  app.post("/api/retailer/createInstantLpo",    upload.fields([{ name: 'quot_no' },{ name: 'po_no' },{ name: 'quot_amount' }, { name: 'companyId' },{ name: 'po_file' },{ name: 'retailerId' },{ name: 'comments' },{ name: 'groupId' }]), RUcontroller.createInstantLpo);







};
