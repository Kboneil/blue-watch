const router = require('express').Router();
const Categories = require('../models/categorySchema');
const Color = require('../models/colorSchema');

router.get('/', function(req, res) {
  console.log('getting categories');

//finds all categories inside category database
  Categories.find({}).then(function(categories){
    console.log('categories ', categories);
        res.send(categories);

  }).catch(function(err){
    console.log('Error in /categories', err);
    res.sendStatus(500);
  });
});

router.post('/', function(req, res) {
  console.log('creating new category');

  var category = new Categories({
      categoryName: req.body.categoryName,
      color: req.body.color,

  });

  category.save().then(function(category) {
      res.send(category);

      Color.find({ 'color': req.body.color}).then(function(color){

        res.sendStatus(200);
        var usedColor = color[0];
        usedColor.inUse=true;


        usedColor.save(function (err, updatedInUse){
          if (err){
            res.sendStatus(500);
            return;
          }



      }).catch(function(err){
        console.log('Error getting review', err);
      });
      });






  }).catch(function(err){
    console.log('Error in /categories', err);
    res.sendStatus(500);
  });
});

//update category route
router.put('/:id', function(req, res) {
  console.log('updating category');
  var id = req.params.id;
  // console.log(id);

  Categories.findById(id, function(err, category){
      if (err){
        res.sendStatus(500);
        return;
      }
      //set values
      category.categoryName = req.body.categoryName;
      category.color = req.body.color;

    category.save(function (err, updatedCategory){
      if (err){
        res.sendStatus(500);
        return;
      }
    //    res.send(updatedCategory);
      Color.find({ 'color': req.body.color}).then(function(color){

        res.sendStatus(200);
    var usedColor = color[0];
        usedColor.inUse=true;


        usedColor.save(function (err, updatedInUse){
          if (err){
            res.sendStatus(500);
            return;
          }



      }).catch(function(err){
        console.log('Error getting review', err);
      });
      });
  });
  });
}); //end update category

//delete category
router.delete('/:id', function(req, res){
  Categories.findByIdAndRemove(req.params.id, function(err, destination){
    if (err){
      res.sendStatus(500);
      return;
    }res.sendStatus(204);
  });
});

module.exports = router;
