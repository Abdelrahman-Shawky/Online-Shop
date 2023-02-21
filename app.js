const http = require('http'); 
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const path = require('path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// not built in like  pug
app.set('view engine', 'ejs');
// set to views folder
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// serve static files
// folder to grant read access
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        // sequelize object
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

// use studff in admin.js
// order still matters
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
// add key to cart 
User.hasOne(Cart);
Cart.belongsTo(User);
// only works with intermediate table
Cart.belongsToMany(Product, {
    through: CartItem
})
Product.belongsToMany(Cart, {
    through: CartItem
});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize
// .sync({force: true})
.sync()
.then(result => {
    return User.findByPk(1);
})
.then(user => {
    if(!user) {
        return User.create({
            name: "Admin",
            email: "admin@admin.com"
        });
    }
    return Promise.resolve(user);
})
.then(user => {
    // return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
    
