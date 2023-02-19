const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require('path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');


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
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
    
