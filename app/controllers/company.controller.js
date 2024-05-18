const db = require("../models");
const config = require("../config/auth.config");
const Company = db.company;
const Role = db.role;
const quotation = db.rquotation;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
  Company.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    companyname: req.body.companyname,
    name: req.body.name,
    address: req.body.address,
    gst: req.body.gst,
    aadhar: req.body.aadhar,
    mobile:req.body.mobile
  })
    .then(company => {
      console.log('comp', company)
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
          res.send(company);
      //  });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.addUser = (req, res) => {
  // Save companyuser to Database
  console.log(req.body,"req")
  db.companyUser.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    address: req.body.address,
    aadhar: req.body.aadhar,
    mobile:req.body.mobile,
    roleId:req.body.roleId,
    companyId:req.body.companyId
  })
    .then(companyUser => {
      console.log('comp', companyUser)
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
          res.send({ message: "Company User registered successfully!" });
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
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.getAll = (req, res) => {
  Company.findAll()
    .then(companies => {
          
           res.status(200).send(companies);
      })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.changePassword = (req, res) => {

  const updatedData = {
    password:  bcrypt.hashSync(req.body.password, 8),
  };
  let dbName = db.company;
  if (req.body.userType == 'companyUser'){
    dbName = db.companyUser
  }else if (req.body.userType == 'retailer'){
    dbName = db.retailer

  }else if (req.body.userType == 'companyAdmin'){
    dbName = db.company

  }
  // Update the user
  dbName.update(updatedData, {
    where: {
      id: req.body.id
    }
  })
  .then((result) => {
    // `result` is an array where the first element is the number of updated rows
    console.log(`${result[0]} rows updated`);
    res.send({message:"Password changed successfully"});

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
    user_type:'companyuser'
  };
  
  // Update the user
  db.qhistory.create(Data)
    .then((result) => {
      // `result` is an array where the first element is the number of updated rows
      console.log(`${result[0]} rows updated`);
      res.send("Quotation Status changed successfully");

    })
    .catch((error) => {
      res.status(500).send({ message: err.message });
    });

}
exports.updateQorders = (req, res) => {
  let orders = req.body.orders;
  for(var i =0;i<orders.length;i++){
 let data =  { gst_dropdown: orders[i].gst_dropdown,
    sgst: orders[i].sgst,
    cgst: orders[i].cgst,
    amount: orders[i].amount,
    gst_perc: orders[i].gst_perc,
    gross_amount: orders[i].gross_amount
  };
  let options = {

    where: {
      id: orders[i].id
    }
  };
  db.orders.update(data, options)
    .then(order=> {
      console.log('order', order)
   
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }

}

exports.quotationStatusUpdate = (req, res) => {
  let statusCode = req.body.status=='Billing'?'PO':req.body.status=='Rejected'?'quotation':'PO';
       db.qhistory.findOne({
        where: {
          retailerQuotationId: req.body.id,
          status:statusCode
        }
      })
        .then(qhistoryRecord => {
          data:{};
          if(req.body.status == 'Billing'){
               data = {
                status:  'Billing',
                retailerQuotationId:req.body.id,
                username:'',
                user_type:'',
                bill_amount: qhistoryRecord.po_amount,
            bill_no:generateRandomAlphaNumeric(8)
               }
              }else if(req.body.status == 'Rejected'){
                 data = {
                  status:  'Rejected',
                  retailerQuotationId:req.body.id,
                  username:'',
                  user_type:'',
                  bill_amount: 0,
                  notes:req.body.note,
                  bill_no:''}
              } else if(req.body.status == 'Cleared'){
                data = {
                 status:  'Cleared',
                 retailerQuotationId:req.body.id,
                 username:'',
                 user_type:'',
                 bill_amount: 0,
                 bill_no:'',
                 notes:req.body.note

             }
          }
        
                
        db.qhistory.create(data).then((result) => {
          let message = "QuotationStatus changed successfully" ;
          if(req.body.status == 'Rejected'){
            message = "Quotation Rejected successfully"
          }
          res.send({ message: message});

    
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
       
        })
  

}
exports.savePOOrders = async (req, res) => {
  let count=0;
  let quot_amount=0;
  let create_count=0;
  let quotId = req.body.orders[0].retailerQuotationId;
      for(let i = 0; i<req.body.orders.length;i++){
        count++;
        quot_amount+= parseInt(req.body.orders[i].gross_amount);
        let orderId = req.body.orders[i].id;
        let order =  req.body.orders[i];
        delete req.body.orders[i].id;
        await db.orders.findOne({
          where: {
            id: orderId
          }
        })
          .then(async poorder => {
            
            if (!poorder) {
             
                res.status(404).send({ message: 'Order not Found'});
            }           
            else{
              create_count++;
              let options = {
                where: {
                  id:orderId
                },
            }
           await db.orders.update(order, options);
          }
         
          }
          )

      }
if(count == req.body.orders.length){
      const Data = {
        status:  'quotation',
        retailerQuotationId:quotId,
        username:'',
        user_type:'',
        quot_amount: quot_amount,
      };
      console.log('data',Data);
      db.qhistory.findOne({
        where: {
          retailerQuotationId: quotId,
          status:'quotation'
        }
      })
        .then(qhistory => {
          
          if (!qhistory) {
            db.qhistory.create(Data)
              .then((result) => {
                res.send({ message: "Quotation saved successfully!" });

                // `result` is an array where the first element is the number of updated rows
          
              })
              .catch((error) => {
                res.status(500).send({ message: error.message });
              });
      }else{
        let options = {
          where: {
            retailerQuotationId:quotId,
            status:'quotation'

          },
      }
       db.qhistory.update({quot_amount:quot_amount}, options);
       res.send({ message: "Quotation saved successfully!" });

      }
      })
    }

}

exports.getPOOrders = (req, res) => {
  let options = {
    where: {
      retailerQuotationId: req.params.quotid
    }
  };
  db.POorders.findAll(options)
    .then(orders=> {
      console.log('quotation', orders);
      res.send(orders);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

}


exports.getUsers = (req, res) => {

 
  // Update the user
  db.companyUser.findAll({
    where: {
      companyId: req.params.companyId
    },
    include:[db.group]
  })
  .then((result) => {
    // `result` is an array where the first element is the number of updated rows
    console.log(`${result[0]} rows updated`);
    res.send(result);

  })
  .catch((error) => {
    res.status(500).send({ message: error.message });
  });

}

exports.getGroups = (req, res) => {

 
  // Update the user
  db.group.findAll({
    where: {
      companyId: req.params.companyId
    }
  })
  .then((result) => {
    // `result` is an array where the first element is the number of updated rows
    res.send(result);

  })
  .catch((error) => {
    res.status(500).send({ message: err.message });
  });

}

exports.addGroup = (req, res) => {
  // Save group to Database
  console.log(req.body,"req")
  db.group.create({
    name:req.body.name,
    companyId:req.body.companyId
  })
    .then(group => {
      console.log('group', group)       
          res.send({ message: "Group created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getDepartments = (req, res) => {

 
  // Update the user
  db.department.findAll({
    where: {
      companyId: req.params.companyId
    }
  })
  .then((result) => {
    // `result` is an array where the first element is the number of updated rows
    res.send(result);

  })
  .catch((error) => {
    res.status(500).send({ message: err.message });
  });

}

exports.addDepartment = (req, res) => {
  // Save group to Database
  console.log(req.body,"req")
  db.department.create({
    name:req.body.name,
    companyId:req.body.companyId
  })
    .then(department => {
      console.log('group', department)       
          res.send({ message: "Group created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.addUsersToGroup = (req, res) => {
  // Save group to Database
    db.groupUser.bulkCreate(req.body.userGroups)
    .then(userGroup => {
      console.log('usergroup', userGroup)       
          res.send({ message: "Users Added to group successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.addUsersToDepartment = (req, res) => {
  // Save group to Database
    db.departmentUser.bulkCreate(req.body.userDepartments)
    .then(userDepartment => {
      console.log('userDepartment', userDepartment)       
          res.send({ message: "Users Added to *Department successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.uploadPO =  (req, res) => {
  console.log('req files', req.files)
    let po_file = req.files.po_file[0].buffer.toString('base64');
    let po_no = req.body.po_no;
    let po_amount = req.body.po_amount;
    let quotId = req.body.retailerQuotationId;
    let fileType =  req.files.po_file[0].mimetype;

    let msg = " PO file uploaded successfully"
    db.qhistory.findOne({
      where: {
        retailerQuotationId: quotId,
        status:'quotation'
      }
    })
      .then(qhistory => {
        
        if (!qhistory) {     
              res.send({ status:404, message: "Quotation Not found!" });
        }else{
            let data = {
                retailerQuotationId:quotId,
                status:'PO',
                po_no:po_no,
                po_amount:po_amount,
                po_file:po_file,
                file_type:fileType
            } ;
          db.qhistory.create(data).then(qhistory => {
                res.send({ qhistory:qhistory, message: msg });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });;

          }
    })
};

exports.uploadBill =  (req, res) => {
  console.log('req files', req.files)
    let bill_file = req.files.bill_file[0].buffer.toString('base64');
    let bill_no = req.body.bill_no;
    let bill_amount = req.body.bill_amount;
    let quotId = req.body.retailerQuotationId;
    let fileType =  req.files.bill_file[0].mimetype;
    let msg = " PO file uploaded successfully"
    db.qhistory.findOne({
      where: {
        retailerQuotationId: quotId,
        status:'PO'
      }
    })
      .then(qhistory => {
        
        if (!qhistory) {     
              res.send({ status:404, message: "Quotation Not found!" });
        }else{
            let data = {
                retailerQuotationId:quotId,
                status:'Billing',
                bill_no:bill_no,
                bill_amount:bill_amount,
                bill_file:bill_file,
                file_type : fileType
            } ;
          db.qhistory.create(data).then(qhistory => {
                res.send({ qhistory:qhistory, message: msg });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });;

          }
    })
};
exports.checkUserName = (req, res) => {
  db.company.findOne({
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
exports.checkCompanyUserName = (req, res) => {
  db.companyUser.findOne({
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

exports.getCompanyImages = (req, res) => {
  let options = {
    where: {
      companyId: req.params.companyId
    }
  };
  db.companyFiles.findAll(options)
    .then(images=> {

      
      res.send(images);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

}



exports.uploadCompanyImages =  (req, res) => {
  console.log('req files', req.files)
    let LGmage = req.files.logoImage[0].buffer.toString('base64');
    let companyId = req.body.companyId;
    db.companyFiles.create({
      companyId:companyId,
      logo:LGmage
    }).then(companyImages => {
      res.send({ message: "company images saved successfully!" });

    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getQuotations = (req, res) => {
  let groups = [];
  let where =  {
    companyId: req.params.companyid
  }
  if(req.params.userType == 2){
      db.groupUser.findAll({
        where: {
          companyuserId: req.params.userId
        }
      })
      .then((groupresults) => {
        // `result` is an array where the first element is the number of updated rows

        if(groupresults.length>0){
          const groups = groupresults.map(result => result.id);

          where.groupId = {
            [Op.in]: groups,
          }
        }
        console.log('where get', where)
  let options = {
    where: where,
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
      where.id = {
        [Op.in]: quotationIdsArray,
      }
      
    }
  quotation.findAll(options)
    .then(quotations=> {
         
      
      res.send(quotations);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

      })
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}else{

  db.qhistory.findAll({
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('retailerQuotationId')), 'count'],
      'retailerQuotationId'
    ],
    where: {
      status: {
        [Op.ne]: 'Rejected'
      }
    },
    group: ['retailerQuotationId'],
    having: db.sequelize.literal('count <= 3')
  }) .then((results) => {
    const quotationIdsArray = results.map(result => result.retailerQuotationId);
    if(quotationIdsArray.length>0){
      where.id = {
        [Op.in]: quotationIdsArray,
      }
    }
    let options = {
      where: where,
      include:[db.orders, db.retailer, db.company, db.qhistory]
    };
  quotation.findAll(options)
  .then(quotations=> {
     
    
    res.send(quotations);

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
})
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
  }
}

exports.getQuotationByBill = (req, res) => {
  let groups = [];
  let billNo = req.params.billNo;
  let where =  {
    companyId: req.params.companyid
  }
  if(req.params.userType == 2){
      db.groupUser.findAll({
        where: {
          companyuserId: req.params.userId
        }
      })
      .then((groupresults) => {
        // `result` is an array where the first element is the number of updated rows

        if(groupresults.length>0){
          const groups = groupresults.map(result => result.id);

          where.groupId = {
            [Op.in]: groups,
          }
        }
        console.log('where get', where)
  let options = {
    where: where,
    include:[db.orders, db.retailer, db.company, db.qhistory]
  };
  db.qhistory.findAll({
    attributes: [
      [db.sequelize.fn('COUNT', db.sequelize.col('retailerQuotationId')), 'count'],
      'retailerQuotationId'
    ],
    where: {
      bill_no: {
        [db.Sequelize.Op.eq]: billNo
      }
    },
    group: ['retailerQuotationId'],
    having: db.sequelize.literal('count <= 3')
  }) .then((results) => {
    const quotationIdsArray = results.map(result => result.retailerQuotationId);
    if(quotationIdsArray.length>0){
      where.id = {
        [Op.in]: quotationIdsArray,
      }
      
    }
  quotation.findOne(options)
    .then(quotations=> {
         
      
      res.send(quotations);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

      })
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}else{
  res.status(501).send({ message: "Don't have access" });

}
}
exports.getclearedQuotations = (req, res) => {
  let groups = [];
  let where = {
    companyId: req.params.companyid
  };

  if (req.params.userType == 2) {
    db.groupUser
      .findAll({
        where: {
          companyuserId: req.params.userId
        }
      })
      .then((groupresults) => {

        if (groupresults.length > 0) {
          groups = groupresults.map(result => result.id);
           where.groupId = {
            [Op.in]: groups
          };
        }

        console.log('where get', where);

        queryQuotations(res, where);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    queryQuotations(res, where);
  }
};

exports.getBillQuotations = (req, res) => {
  let groups = [];
  let where = {
    companyId: req.params.companyid
  };

  if (req.params.userType == 2) {
    db.groupUser
      .findAll({
        where: {
          companyuserId: req.params.userId
        }
      })
      .then((groupresults) => {

        if (groupresults.length > 0) {
          groups = groupresults.map(result => result.id);
           where.groupId = {
            [Op.in]: groups
          };
        }

        queryBillQuotations(res, where);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    queryBillQuotations(res, where);
  }
};
function queryBillQuotations(res, where) {
  db.qhistory
    .findAll({
      where: {
        status: {
          [Op.in]: ['Billing'],
          [Op.notIn]: ['Cleared']
        }
      },
      group: ['status', 'id'] // Include 'id' in the GROUP BY clause
    
    })
    .then((results) => {
      console.log(results,"ravi")
      if (results.length === 0) {
        res.send([]);
        return; // Ensure to exit the function after sending the response
      }

      const quotationIdsArray = results.map((result) => result.retailerQuotationId);
      if (quotationIdsArray.length > 0) {
        where.id = {
          [Op.in]: quotationIdsArray
        };
      }

      let options = {
        where: where,
        include: [db.orders, db.retailer, db.company, db.qhistory]
      };

      quotation
        .findAll(options)
        .then((quotations) => {
          res.send(quotations);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

function queryQuotations(res, where) {
  db.qhistory
    .findAll({
      where: {
        status: 'Cleared'
      }
    })
    .then((results) => {
      if (results.length === 0) {
        res.send([]);
        return; // Ensure to exit the function after sending the response
      }

      const quotationIdsArray = results.map((result) => result.retailerQuotationId);
      if (quotationIdsArray.length > 0) {
        where.id = {
          [Op.in]: quotationIdsArray
        };
      }

      let options = {
        where: where,
        include: [db.orders, db.retailer, db.company, db.qhistory]
      };

      quotation
        .findAll(options)
        .then((quotations) => {
          res.send(quotations);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

exports.saveQuotationDepartmentStatus = (req, res) => {
  console.log(req.body,"req")
  db.quotationDepartmentStatus.create({
    comments:req.body.comments,
    companyuserId:req.body.companyUserId,
    retailerQuotationId:req.body.retailerQuotationId,
    departmentId:req.body.departmentId

  })
    .then(qds => {
      console.log('qds', qds)       
          res.send({ message: "Moved to Department Successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getQuotationDepartments = (req, res) => {
  let options = {
    where: {
      retailerQuotationId: req.params.quotid
    } ,
    include:[db.companyUser,db.department],

  };
  db.quotationDepartmentStatus.findAll(options)
      .then(statuses=> {
      console.log('quotation', statuses);
      res.send(statuses);

      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

}