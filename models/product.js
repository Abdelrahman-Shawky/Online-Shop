const fs = require('fs');
const path = require('path');
const { threadId } = require('worker_threads');
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
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id){
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) =>{
                    console.log(err);
                    });
            }
            else {
            this.id = Math.random().toString();

            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) =>{
            console.log(err);
            });
        }
        });
    }

    static delete(prodId) {
        getProductsFromFile((products) => {
            // const updatedProducts = products.filter(prod => prod.id !== prodId);
            const existingProductIndex = products.findIndex(prod => prod.id === prodId);
            const updatedProducts = [...products];
            updatedProducts.splice(existingProductIndex, 1);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) =>{
                console.log(err);
                });
        });
    }

    // call this method from class not object
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findbyId(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};