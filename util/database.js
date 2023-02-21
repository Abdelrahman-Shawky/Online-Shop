const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

// connect and store connection
const MongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://abdelrahmanshawky:nuUTJaF9KJQqSrUE@cluster0.cgns5uz.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected !!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    }); 
};

// get connection if connected
const getDb = () => {
    if(_db) {
        return  _db;
    }
    throw 'No Database Found !!';
};

exports.mongoConnect = MongoConnect;
exports.getDb = getDb;



