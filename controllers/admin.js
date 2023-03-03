const Product = require('../models/product')

exports.getProducts =(req,res, next) => {
    Product.find({
        userId: req.user._id
    })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
        console.log(products);
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
    });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) =>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/add-product', {
        pageTitle: "Add Product", 
        path: '/admin/add-product',
        editing: false
    }); 
};

exports.postAddProduct =  (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description:  description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
    .then(result => {
        console.log("Created Product !!")
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));    
};

exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
    .then(product => {
        if(!product)
        {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: "Edit Product", 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
            }); 
    })
    .catch(err => {
        console.log(err);
        return res.redirect('/');
    });   
};

exports.postEditProduct =  (req,res,next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new Product(title, price, description, imageUrl, prodId);
    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('')
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        return product.save().then(result => {
            console.log('Updated Product !!')
            res.redirect('/admin/products');
        });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct =  (req,res,next) => {
    const prodId = req.body.productId;
    // Product.findByIdAndRemove(prodId)
    Product.deleteOne({
        _id: prodId, 
        userId: req.user._id
    })
    .then(() => {
        console.log('Deleted Product !!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};


