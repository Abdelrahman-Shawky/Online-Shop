const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');
const path = require('path');
const errorController = require('./controllers/error');
// const MongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = process.env.DB_URI;
const port = process.env.PORT || 3000;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    }); 
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrftoken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404); // catch all

// Error middleware
app.use((error, req, res, next) => {
    res.redirect('/500');
});

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(port);
})
.catch(err => console.log(err));
