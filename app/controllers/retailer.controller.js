const db = require("../models");
const config = require("../config/auth.config");
const Retailer = db.retailer;
const Role = db.role;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const quotation = db.rquotation;
const orders = db.orders;
const Qorders = db.Qorders;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const companyUserModel = require("../models/companyUser.model");
function generateRandomAlphaNumeric(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
exports.signup = (req, res) => {
  // Save companyuser to Database
  console.log(req.body,"req")
  Retailer.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    shopname: req.body.shopname,
    name: req.body.name,
    address: req.body.address,
    gst: req.body.gst,
    aadhar: req.body.aadhar,
    mobile:req.body.mobile
  })
    .then(retailer => {
      console.log('comp', retailer)
      if (req.body.roles) {
        // Role.findAll({
        //   where: {
        //     name: {
        //       [Op.or]: req.body.roles
        //     }
        //   }
        // }).then(roles => {
        //   user.setRoles(roles).then(() => {
        //     res.send({ message: "User registered successfully!" });
        //   });
        // });
      } else {
        // user role = 1
        //user.setRoles([1]).then(() => {
          res.send({ message: "Retailer registered successfully!" ,id:retailer.id});
      //  });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          userData: user,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.addQuotation = (req, res) => {

  console.log(req.body,"req")
  let ordercount=0;
  let quot_amount=0;
  let quotId=0;
  let quot_no = generateRandomAlphaNumeric(8)
  quotation.create({
    retailerId: req.body.retailer_id,
    companyId: req.body.company_id,
    quotation_no: quot_no,
    groupId:req.body.groupId

  })
    .then(quotation => {
      quotId = quotation.id;
      console.log('quotation', quotation)
      for(let i = 0; i<req.body.orders.length;i++){
        ordercount++;
          req.body.orders[i].retailerQuotationId = quotation.id;
        orders.create(req.body.orders[i]).then(order=>{
         console.log(orders);
        });
      }
      if(ordercount == req.body.orders.length){
        const Data = {
          status:  'quotation',
          retailerQuotationId:quotId,
          username:'',
          user_type:'',
          quot_amount: quot_amount,
          quot_no:quot_no
        };
        db.qhistory.create(Data)
        .then((result) => {
          res.send({ message: "Quotation saved successfully!" });

          // `result` is an array where the first element is the number of updated rows
    
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
      }

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

}

exports.getQuotations = (req, res) => {
  let options = {
    where: {
      retailerId: req.params.shopid
    },
    include:[db.orders, db.retailer, db.company, db.qhistory]
  };
  db.qhistory.findAll({
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('retailerQuotationId')), 'count'],
      'retailerQuotationId'
    ],
    where: {
      status: {
        [db.Sequelize.Op.ne]: 'Rejected'
      }
    },
    group: ['retailerQuotationId'],
    having: db.sequelize.literal('count <= 3')
  }) .then((results) => {
    const quotationIdsArray = results.map(result => result.retailerQuotationId);
    if(quotationIdsArray.length>0){
      options.where.id = {
        [Op.in]: quotationIdsArray,
      }
      
    }
        quotation.findAll(options)
          .then(quotations=> {
            console.log('quotation', quotations)
            res.send(quotations);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}


exports.changePassword = (req, res) => {

  const userIdToUpdate = 1; // Replace with the actual user ID you want to update
  const updatedData = {
    password:  bcrypt.hashSync(req.body.password, 8),
  };
  
  // Update the user
  Retailer.update(updatedData, {
    where: {
      id: req.body.id
    }
  })
    .then((result) => {
      // `result` is an array where the first element is the number of updated rows
      console.log(`${result[0]} rows updated`);
      res.send("Password changed successfully");

    })
    .catch((error) => {
      res.status(500).send({ message: err.message });
    });

}


exports.addQuotationStatus= (req, res) => {

  const userIdToUpdate = 1; // Replace with the actual user ID you want to update
  const Data = {
    status:  req.body.status,
    retailerQuotationId:req.body.quotationId,
    username:req.body.username,
    user_type:'retailer'
  };
  
  // Update the user
  db.qhistory.save(Data)
    .then((result) => {
      // `result` is an array where the first element is the number of updated rows
      console.log(`${result[0]} rows updated`);
      res.send("Quotation Status changed successfully");

    })
    .catch((error) => {
      res.status(500).send({ message: err.message });
    });

}

exports.getAll = (req, res) => {
  Retailer.findAll()
    .then(retailers => {
          
           res.status(200).send(retailers);
      })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createInstantBill = (req, res) => {
  console.log('req files', req.files)
  let quot_file = req.files.quot_file[0].buffer.toString('base64');
  let bill_no = req.body.bill_no;

  let quot_amount = req.body.quot_amount;
  let retailerId = req.body.retailerId;
  let companyId = req.body.companyId;
  let groupId = req.body.groupId;
  let comments = req.body.comments;
  let msg = " Instant Bill created successfully";
  let fileType =  req.files.quot_file[0].mimetype;

          quotation.create({
            retailerId: retailerId,
            companyId: companyId,
            groupId:groupId,
            quotation_no: generateRandomAlphaNumeric(8),
            quot_type:'instantQuotation',
              comments:comments
        
          })
            .then(qtn => {
              let hdata = {
                retailerQuotationId:qtn.id,
                status:'bill',
                bill_no:bill_no,
                bill_amount:quot_amount,
                bill_file:quot_file,
                file_type:fileType
            } ;
              db.qhistory.create(hdata).then(qhistory => {
                res.send({ qhistory:qhistory, message: msg });
          }).catch(err => {
            res.status(500).send({ message: err.message });
          });
            }).catch(err => {
              res.status(500).send({ message: err.message });
            });
          };

          exports.createInstantLpo = (req, res) => {
            console.log('req files', req.files)
            let quot_file = req.files.po_file[0].buffer.toString('base64');
            let po_no = req.body.po_no;
          
            let quot_amount = req.body.quot_amount;
            let retailerId = req.body.retailerId;
            let companyId = req.body.companyId;
            let groupId = req.body.groupId;
            let comments = req.body.comments;
            let msg = " Instant LPO created successfully";
            let fileType =  req.files.po_file[0].mimetype;
          
                    quotation.create({
                      retailerId: retailerId,
                      companyId: companyId,
                      groupId:groupId,
                      quotation_no: generateRandomAlphaNumeric(8),
                      quot_type:'instantLpo',
                        comments:comments
                  
                    })
                      .then(qtn => {
                        let hdata = {
                          retailerQuotationId:qtn.id,
                          status:'PO',
                          po_no:po_no,
                          po_amount:quot_amount,
                          po_file:quot_file,
                          file_type:fileType
                      } ;
                        db.qhistory.create(hdata).then(qhistory => {
                          res.send({ qhistory:qhistory, message: msg });
                    }).catch(err => {
                      res.status(500).send({ message: err.message });
                    });
                      }).catch(err => {
                        res.status(500).send({ message: err.message });
                      });
                    };     
exports.createInstantQuotation = (req, res) => {
  let quot_file = req.files.quot_file[0].buffer.toString('base64');
  let quot_no = req.body.quot_no;
  let bill_no = req.body.bill_no;
  let quot_amount = req.body.quot_amount;
  let retailerId = req.body.retailerId;
  let companyId = req.body.companyId;
  let comments = req.body.comments;
  let groupId = req.body.groupId;
  let msg = " Instant Quotation created successfully";
  quotation.create({
    retailerId: retailerId,
    companyId: companyId,
    quotation_no: quot_no,
    quot_type:'instantQuotation',
    groupId:groupId,
    comments:comments
  })
    .then(quotation => {
              let data = {
              retailerQuotationId:quotation.id,
              status:'quotation',
              quot_no:quot_no,
              quot_amount:quot_amount,
              quot_file:quot_file,

          } ;
        db.qhistory.create(data).then(qhistory => {
              res.send({ qhistory:qhistory, message: msg });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });;

        }
)};
exports.getQuotationsCountByRetailerId = (req, res) => {
    let retailerId = req.params.retailerId;
    db.rquotation.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', sequelize.literal('*')), 'count'], // Count(*) as count
        'companyId',
      ],
      include: [{
        model: db.company,
        attributes: ['companyname'], // include only if you want to select specific columns from Company
      }],
      where: {
        retailerId: retailerId,
      },
      group: ['companyId'],
    })
  .then(results => {
    res.send(results);
  })
  .catch(error => {
    res.status(500).send({ message: error.message });
  });

};
exports.checkUserName = (req, res) => {
  Retailer.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (user) {
        return res.status(409).send({ data:true,message: "User already exists." });
      }else{
        return res.status(200).send({ data:false, message: "" });

      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.getRetailerImages = (req, res) => {
  let options = {
    where: {
      retailerId: req.params.retailerId
    }
  };
  db.retailerImages.findAll(options)
    .then(images=> {

      
      res.send(images);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

}
exports.getClearedQuotations = (req, res) => {
  let options = {
    where: {
      retailerId: req.params.shopid
    },
    include: [db.orders, db.retailer, db.company, db.qhistory]
  };

  db.qhistory
    .findAll({
      where: {
        status: 'Cleared'
      }
    })
    .then((results) => {
      if (results.length === 0) {
        res.send([]); // Sending an empty array when there are no cleared quotations
        return; // Ensure to exit the function after sending the response
      }

      const quotationIdsArray = results.map((result) => result.retailerQuotationId);
      if (quotationIdsArray.length > 0) {
        options.where.id = {
          [Op.in]: quotationIdsArray
        };
      }

      quotation
        .findAll(options)
        .then((quotations) => {
          console.log('quotation', quotations);
          res.send(quotations);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.getRejectedQuotations = (req, res) => {
  let options = {
    where: {
      retailerId: req.params.shopid
    },
    include: [db.orders, db.retailer, db.company, db.qhistory]
  };

  db.qhistory
    .findAll({
      where: {
        status: 'Rejected'
      }
    })
    .then((results) => {
      if (results.length === 0) {
        res.send([]); // Sending an empty array when there are no cleared quotations
        return; // Ensure to exit the function after sending the response
      }

      const quotationIdsArray = results.map((result) => result.retailerQuotationId);
      if (quotationIdsArray.length > 0) {
        options.where.id = {
          [Op.in]: quotationIdsArray
        };
      }

      quotation
        .findAll(options)
        .then((quotations) => {
          console.log('quotation', quotations);
          res.send(quotations);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};