const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const CUcontroller = require("../controllers/company.controller");
const RUcontroller = require("../controllers/retailer.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
      
    );
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/companyuser/register", CUcontroller.signup );
  app.post("/api/retailuser/register", RUcontroller.signup );


  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/retsignin", controller.retsignin);
  app.post("/api/auth/cusignin", controller.cusignin);

  app.post("/api/auth/signout", controller.signout);


};
