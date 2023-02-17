const fs = require('fs');
const path = require('path');
const p =path.join(path.dirname(require.main.filename), 
    'data','products.json');

const getProductsFromFile = cb => {
    
    fs.readFile(p, (err, data)=>{
        if (err){
            return cb([]);
        }
        else {
            cb(JSON.parse(data));
        }
    });  
};

module.exports = class Product {
    constructor(title, imageUrl, description, price){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) =>{
            console.log(err);
        });
        // const p =path.join(path.dirname(require.main.filename), 
        // 'data','products.json');
        // fs.readFile(p, (err, data) =>{
        //     let products = [];
        //     if (!err){
        //         products = JSON.parse(data);
        //     }
        //     products.push(this);
        //     fs.writeFile(p, JSON.stringify(products), (err) =>{
        //     console.log(err);
        //     });
        });
    }

    // call this method from class not object
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};