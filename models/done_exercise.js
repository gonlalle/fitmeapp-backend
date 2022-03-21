var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const done_exercise = new Schema({
    _id: String,
    username: String,
    name: String,
    date: String,
    kcal: Number
});

module.exports = mongoose.model('done_exercise', done_exercise);