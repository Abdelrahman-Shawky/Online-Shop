const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require('path');
const errorController = require('./controllers/error');
// const MongoConnect = require('./util/database').mongoConnect;
// const User = require('./models/user');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req,res,next) => {
//     User.findById('63f53753eefdcc4712dcd4dd')
//     .then(user => {
//         // allow to use user methods
//         req.user = new User(user.name, user.email, user.cart, user._id);
//         next();
//     })
//     .catch(err => console.log(err));
//     // next();
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://abdelrahmanshawky:nuUTJaF9KJQqSrUE@cluster0.cgns5uz.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));
