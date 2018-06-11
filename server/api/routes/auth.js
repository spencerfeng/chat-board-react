const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const checkAuth = require('../middleware/check-auth');

// Include models
const User = require('../../models/user');

// Use dotnv module to load environment variables from a .env file into process.env 
require('dotenv').config()

// Create the 'local-signup' named strategy using passport-local
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password', 
  passReqToCallback: true,
  session: false
}, (req, username, password, done) => {
  User.findOne({'email': username}).exec()
    .then(user => { 
      if (user) {
        return done(null, false);
      }

      const newUser = new User();

      // Generate the hashed password
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          // User can be created when reaching here
          newUser._id = new mongoose.Types.ObjectId();
          newUser.email = username;
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.password = hash;

          // First user is an admin
          return User.count().exec();
        })
        .then(count => {
          if (count === 0) {
            newUser.role = 'admin';
          } else {
            newUser.role = 'user';
          }

          return newUser.save();
        })
        .then(result => {
          return done(null, {
            _id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
          });
        })
        .catch(err => {
          return done(err);
        });
    })
    .catch(err => {
      return done(err);
    });
}));

// Create the 'local-signin' named strategy using passport-local
passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password', 
  passReqToCallback: true,
  session: false
}, (req, username, password, done) => {
  let user = null;

  User.findOne({'email': username}).exec()
    .then(response => {
      if (!response) {
        return done(null, false);
      }

      // Assign the user object to a variable in a higher scope
      // so that it can be used in chained promises later.
      user = response;

      // If user exists, then check if the password is correct
      return bcrypt.compare(password, response.password);
    })
    .then(res => {
      if (res === false) {
        return done(null, false);
      } else {
        return done(null, {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        });
      }
    })
    .catch(err => {
      return done(err);
    });
}));


// Route to handle user signup
router.post('/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    }

    if (!user) {
      return res.status(422).json({
        status: 'fail',
        code: '422',
        data: {
          title: 'This email has been used for another account'
        }
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        role: user.role
      },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60
      }
    );

    return res.status(201).json({
      status: 'success',
      code: '201',
      data: {
        token: token,
        user: user
      }
    })
  })(req, res, next);
});

// Route to handle user signin
router.post('/signin', (req, res, next) => {
  passport.authenticate('local-signin', (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    }

    if (!user) {
      return res.status(422).json({
        status: 'failed',
        code: '422',
        data: {
          title: 'User credentials are not correct'
        }
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        role: user.role
      },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60
      }
    );

    return res.status(200).json({
      status: 'success',
      code: '200',
      data: {
        token: token,
        user: user
      }
    });

  })(req, res, next);
});

router.get('/check', checkAuth, (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    code: '200',
    data: {
      user: req.userData
    }
  });
});

module.exports = router;