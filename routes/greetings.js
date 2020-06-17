const express = require('express');
const router = express.Router();

// Article Model
let Greeting = require('../models/greeting');
// User Model
let User = require('../models/user');

// Add Route
router.get('/send', ensureAuthenticated, function(req, res){
  User.find({}, function(err, users){
    res.render('send_invitation',{
      users:users
    })
  });
});

// Add Submit POST Route
router.post('/send', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('send_invitation', {
      
      errors:errors
    });
  } else {
    let greeting = new Greeting();
    greeting.title = req.body.title;
    greeting.author = req.user._id;
    greeting.body = req.body.body;
    greeting.date = new Date();
    greeting.rec = req.body.rec;

   greeting.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','invitation sent');
        res.redirect('/');
      }
    });
  }
});



// Get Single Article
router.get('/:id', function(req, res){
  Greeting.findById(req.params.id, function(err, greeting){
    User.findById(greeting.author, function(err, user){
      res.render('greeting', {
        greeting:greeting,
        author: user.name,
      
      });
    });
  });
});

router.post('/:id', function(req, res){
  Greeting.findById(req.params.id, function(err, greet){
  let greeting = {};
  greeting.title = greet.title;
  greeting.author = greet.author;
  greeting.body = greet.body;
  greeting.rec = greet.rec;
  greeting.date = greet.date;
  greeting.status = req.body.status;

  let query = {_id:req.params.id}

  Greeting.update(query, greeting, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'reply sent');
      res.redirect('/');
    }
  });
});
});


// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}



module.exports = router;
