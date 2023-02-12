const express = require('express');

// path package to know path of files
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) =>{
    console.log('In main moiddleware');
    console.log('shop.js',adminData.products);
    // import path correctly
    // global variable holding abs file path
    // join doesn't use slashes
    // ../ to go up one level
    res.sendFile(path.join(rootDir, 'views','shop.html'));
});

module.exports = router;
