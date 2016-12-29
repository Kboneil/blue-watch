const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = require('express').Router();
const mongoose = require('mongoose');
const Review = require('../models/reviewSchema.js');
const nodemailer = require('nodemailer');
const Admin = require('../models/adminSchema');

router.post('/', function(req,res){
  var review = new Review(req.body);

  review.save().then(function(review){
      res.sendStatus(201);
    }).catch(function(err){
      console.log('error in post review', err);
      res.sendStatus(500);
  });
});

router.get('/:id', function(req, res) {
  var id = req.params.id;
Review.find({ "resource_id" : id, "approved": true}).then(function(review){
  res.send(review);
}).catch(function(err){
  console.log('Error getting review', err);
});
});


router.post('/mail', function(req,res){
  Admin.find({"accessLevel":"yes"}).then(function(people){

    var transporter = nodemailer.createTransport('smtps://bwatch36%40gmail.com:bluewatch36@smtp.gmail.com');

    for (var i=0; i < people.length; i++){
        console.log(people[i].email);

      var mailOptions = {
       from: 'bwatch36@gmail.com',
       to:people[i].email,
       subject: 'A new review has been added ',
       html: '<div><p>You have a new review pending for approval! Click link below to check review!</p></div><div> <a href="http://localhost:3000/approval">Click Here </a></div>'
      };
      //
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);

        }
          res.send(info.response);
      }); // end sendMail

    }


  }).catch(function(err){
    console.log('Error in /mail', err);
    res.sendStatus(500);

  }); //End of Admin.find

});

module.exports = router;
