const db = require("../models");

exports.uploadImage =  (req, res) => {
  // Access the uploaded files using req.files
  const files = req.files;

  // Process the files as needed (e.g., save to a database, resize, etc.)
  // In this example, we're just sending back a JSON response with the file information
  res.json({
    message: 'Files uploaded successfully!',
    files: files.map(file => ({
      encodedFile: file.buffer.toString('base64'),
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }))
  });
};
exports.uploadRetailerImages =  (req, res) => {
  console.log('req files', req.files)
    let AImage = req.files.AadharImage[0].buffer.toString('base64');
    let PImage = req.files.panImage[0].buffer.toString('base64');
    let LGmage = req.files.logoImage[0].buffer.toString('base64');
    let CImage = req.files.checkImage[0].buffer.toString('base64');
    let GImage = req.files.gstImage[0].buffer.toString('base64');
    let retailerId = req.body.retailerId;
    db.retailerImages.create({
      retailerId:retailerId,
      aadhar:AImage,
      check:CImage,
      gst:GImage,
      pan:PImage,
      logo:LGmage
    }).then(retailerImages => {
      res.send({ message: "Retailer images saved successfully!" });

    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.uploadImage =  (req, res) => {
  console.log('req files', req.files)
    let OImage = req.files.orderImage[0].buffer.toString('base64');
    let name = req.body.name;
    let quotId = req.body.quotId;
    let msg = name+" file uploaded successfully"
    db.orderImages.create({
      quotationId:quotId,
      name:name,
      file:OImage,
  
    }).then(orderImages => {
      res.send({ message:  msg });

    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.uploadCompanyImages =  (req, res) => {
  console.log('req files', req.files)
    let LGmage = req.files.logoImage[0].buffer.toString('base64');
    let companyId = req.body.companyIdId;
    db.companyFiles.create({
      companyId:companyId,
      logo:LGmage
    }).then(companyImages => {
      res.send({ message: "Company image saved successfully!" });

    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
