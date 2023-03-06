const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
    }
  User.findOne({
    email:email
  })
    .then(user => {
        if (!user) {
          console.log('not found');
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: "Invalid Email or Password",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
          console.log(hashedPassword)
        }
        );
        bcrypt.compare(password, user.password)
        .then(resultMatch => {
            if (resultMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            console.log('Passowrds Do not Match');
            console.log(resultMatch);
            // console.log(user.password);

            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: "Invalid Email or Password",
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatuseCode = 500;
      return next(error); //skip all middleware till error handling middleware
  });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log(errors);
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: {email: email, password: password, confirmPassword: confirmPassword},
        validationErrors: errors.array()
      });
    }

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
          const user = new User({
              email: email,
              password: hashedPassword,
              cart: {items: []}
          });
          return user.save();
      })
      .then(result => {
          res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatuseCode = 500;
        return next(error); //skip all middleware till error handling middleware
      });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

