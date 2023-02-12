const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

// mini express app
// same as app. functions
const router = express.Router();

const products = [];


router.get('/add-product', (req, res, next) =>{
    console.log('In the moiddleware');
    res.sendFile(path.join(rootDir, 'views','add-product.html'));
});

router.post('/add-product', (req,res,next) => {
    console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
});

// module.exports = router;
exports.routes = router;
exports.products = products;
