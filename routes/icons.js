const router = require('express').Router();
const Color = require('../models/colorSchema');

router.get('/', function(req, res) {

//finds all icons inside color database
  Color.find({}).then(function(icons){
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

}); //end update Color

module.exports = router;
