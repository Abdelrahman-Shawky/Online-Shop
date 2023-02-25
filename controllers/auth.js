const User = require('../models/user.js');

exports.getLogin =(req,res, next) => {   
    const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true'; 
    console.log(req.session.user)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAthenticated: isLoggedIn
    });
};

exports.postLogin =(req,res, next) => {    
    User.findById('63f6841c7d78c0ae7a5763c5')
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });
    })
    .catch(err => console.log(err));  
};

exports.postLogout =(req,res, next) => {    
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};