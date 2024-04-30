var express = require('express');
var router = express.Router();
const roomSchame = require('../schema/roomSchema');
const encryptor = require('simple-encryptor')("mother Father Father Mother");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/createRoom', async function(req, res){
  const {password, hr} = req.body;
  const newRoom = new roomSchame({
    name: '1234',
    password: encryptor.encrypt(password),
    hr: hr
  });
  await newRoom.save();
  res.send(password+hr);
});

module.exports = router;
