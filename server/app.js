require('dotenv').config();

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var sequelize = require('./db.js');
var User = sequelize.import('./models/user');

sequelize.sync()
// User.sync(); // sync( {force: true}) WARNING: This will DROP the table!

app.use(bodyParser.json());
app.use(require('./middleware/headers'));
app.use(require('./middleware/validate-session'));
app.use('/api/user', require('./routes/user.js'));
//login route
app.use('/api/login', require('./routes/session'));
app.use('/api/definition', require('./routes/definition'));
app.use('/api/log', require('./routes/log'));
app.use('/api/test', function (req, res) {
    res.send("Hello World!!");
});


http.listen(process.env.PORT || 3000, function () {
    console.log("app is listening on port 3000...");
});

//Need to create a user object and use sequelize to put that user into
//our database.