var express = require('express');
var router = express.Router();
var Applicant = require('../models/Applicant');
var mid = require('../middleware');

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  Applicant.findById(req.session.userId)
      .exec(function (error, applicant) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: applicant.firstName, status: applicant.status, tags: applicant.tags});
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});
// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    console.log(req.body);
    Applicant.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  console.log(req.body)
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  console.log(req.body);
  if (req.body.firstName &&
    req.body.middleName &&
    req.body.lastName &&
    req.body.contactPhone &&
    req.body.email &&
    req.body.address &&
    req.body.zip &&
    req.body.city &&
    req.body.state &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }
      
      
      // create object with form input
      var userData = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        contactPhone: req.body.contactPhone,
        email: req.body.email,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city,
        state: req.body.state,
        password: req.body.password,
        tags: req.body.tags
      };

      // use schema's `create` method to insert document into Mongo
      Applicant.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          console.log(user);
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
