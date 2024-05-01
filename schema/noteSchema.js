const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    note: String
})
module.exports = mongoose.model('notes', noteSchema);