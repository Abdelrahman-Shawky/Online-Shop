const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require('path');
const errorController = require('./controllers/error');
const MongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    User.findById('63f53753eefdcc4712dcd4dd')
    .then(user => {
        // allow to use user methods
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err));
    // next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

MongoConnect(() =>{
    // User.findById(1)
    // .then(user => {
    //     if(!user){
    //         user = new User('admin', 'admin@admin.com');
    //         user.save()
    //     }
    //     return Promise.resolve(user);
    // })
    // .then(user => {
    //     console.log(user);
    // })
    // .catch(err => console.log(err));
    app.listen(3000); 
});
