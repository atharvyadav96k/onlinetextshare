const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    name: String,
    note: String
})
module.exports = mongoose.model('notes', noteSchema);