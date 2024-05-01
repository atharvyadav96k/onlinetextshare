const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/onlinetextshare')
const roomShema = mongoose.Schema({
    name: String,
    password: String,
    hr: Number,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'notes'
        }
    ]
});

module.exports = mongoose.model("room", roomShema);
