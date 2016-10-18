var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('lineup', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to hierarchy database");
        db.collection('lineups', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The hierarchy collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving Line-up: ' + id);
    db.collection('lineups', function(err, collection) {
        collection.findOne({'_id':new mongo.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('lineups', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding Line-up: ' + JSON.stringify(wine));
    db.collection('lineups', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating Line-up: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('lineups', function(err, collection) {
        collection.update({'_id':new mongo.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating Line-up: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting Line-up: ' + id);
    db.collection('lineups', function(err, collection) {
        collection.remove({'_id':new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var lineups = [
    {
        unit: "1001",
        address: "5501 W 88TH AVE",
        city: "WESTMINSTER",
        State: "CO",
        zip: "80031",
        country: "JEFFERSON",
        phone: "3034122300"
    },
    {
        unit: "1003",
        address: "77 ROCKINGHAM PARK BLVD  ",
        city: "SALEM",
        State: "NH",
        zip: "3079",
        country: "ROCKINGHAM",
        phone: "6038947700"
    }];

    db.collection('lineups', function(err, collection) {
        collection.insert(lineups, {safe:true}, function(err, result) {});
    });

};