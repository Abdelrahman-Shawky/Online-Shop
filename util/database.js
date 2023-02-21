const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://abdelrahmanshawky:nuUTJaF9KJQqSrUE@cluster0.cgns5uz.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected !!');
        callback(client);
    })
    .catch(err => console.log(err));
};

module.exports = MongoConnect;



