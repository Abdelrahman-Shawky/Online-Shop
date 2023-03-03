const express = require('express');
const {check, body} = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    check('email').isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(), 
    body('password', 'Invalid Password').isLength({min:4}).isAlphanumeric()
    ], authController.postLogin);

router.post('/signup', [
check('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
    return User.findOne({
        email: value
    }).then(userDoc => {
        if (userDoc) {
            return Promise.reject('E-mail exists already');
        }
    })
}).normalizeEmail(), 
body('password', 'Invalid Password').isLength({min:5}).isAlphanumeric(),
body('confirmPassword').custom((value, {req}) => {
    if(value === req.body.password) {
        throw new Error('Passwords has to match!')
    }
    return true;
})
],
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

module.exports = router;