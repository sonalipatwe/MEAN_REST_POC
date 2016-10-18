var express = require('express'),
    lineups = require('./routes/lineups');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/lineups', lineups.findAll);
app.get('/lineups/:id', lineups.findById);
app.post('/lineups', lineups.addWine);
app.put('/lineups/:id', lineups.updateWine);
app.delete('/lineups/:id', lineups.deleteWine);

app.listen(3000);
console.log('Listening on port 3000...');