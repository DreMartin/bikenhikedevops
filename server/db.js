var Sequelize = require('sequelize');
var sequelize = new Sequelize('bikenhike', 'postgres', 'pgDB@1150', {
    host:'localhost',
	dialect: 'postgres'
});

sequelize.authenticate().then(
    function () {
        console.log('connected to workoutlog postgres db');
    },
    function (err) {
        console.log(err);
    }
);

var User = sequelize.import('./models/user');

module.exports = sequelize;