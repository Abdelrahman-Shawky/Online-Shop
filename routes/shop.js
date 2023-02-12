const express = require('express');

// path package to know path of files
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) =>{
    const products = adminData.products;
    // already defined folder views and pug
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'}); 
});

module.exports = router;
