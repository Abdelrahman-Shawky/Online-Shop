const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require('path');
const expressHbs = require('express-handlebars');

const app = express();

// not built in like  pug
app.set('view engine', 'ejs');
// set to views folder
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended: false}));
// serve static files
// folder to grant read access
app.use(express.static(path.join(__dirname, 'public')))

// use studff in admin.js
// order still matters
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404.pug', {pageTitle: '404'});
});
    
app.listen(3000)