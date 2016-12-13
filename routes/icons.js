const router = require('express').Router();
const Color = require('../models/colorSchema');

router.get('/', function(req, res) {
  console.log('getting icons');

//finds all icons inside color database
  Color.find({}).then(function(icons){
    // console.log('icons ', icons);
        res.send(icons);

  }).catch(function(err){
    console.log('Error in /icons', err);
    res.sendStatus(500);
  });
});

//update color
router.put('/:id', function(req, res) {
  console.log('updating color');
  var oldColor = req.params.id;
  console.log(oldColor);

  Color.find({
      'color': oldColor
  }).then(function(color) {
      console.log(color);
      color[0].inUse = false;

      color[0].save(function(err, updatedInUse) {
          console.log('color updated!', updatedInUse);
          if (err) {
              res.sendStatus(500);
              return;
          }
           res.send(updatedInUse);
      }); // End of color saved


  }); //End of color find

  // Color.findById(id, function(err, category){
  //     if (err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     //set values
  //     data.id = req.body.id;
  //     data.pin = req.body.pin;
  //     data.color = req.body.color;
  //     data.inUse = req.body.inUse;
  //
  //   color.save(function (err, updatedColor){
  //     if (err){
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.send(updatedColor);
  //   });
  // });
}); //end update Color

module.exports = router;
