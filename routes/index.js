var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
const roomSchema = require('../schema/roomSchema');
const encryptor = require('simple-encryptor')("mother Father Father Mother");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/createRoom', async function (req, res) {
  const { password, hr } = req.body;
  let isUniqueRoom = false;
  let name;
  let timeLimit;
  if (hr > 5) {
    res.status(500).send({
      message: "You can't create room time more than 5hr",
      success: false
    });
  } else {
    while (!isUniqueRoom) {
      name = generateRoom();
      isUniqueRoom = isRoomIsUnique(name);
    }
    if (hr) {
      console.log(hr)
      timeLimit = addRoomTimeLimit(hr);
    } else {
      console.log("noFound")
      timeLimit = addRoomTimeLimit();
    }
    const newRoom = new roomSchema({
      name: name,
      password: encryptor.encrypt(password),
      hr: timeLimit
    });
    await newRoom.save();
    res.send(name);
  }

});

function generateRoom() {
  const name = randomstring.generate({
    length: 4,
    charset: 'alphabetic'
  });
  return name;
}
async function isRoomIsUnique(name) {
  const rooms = await roomSchema.findOne({ name: name });
  return !rooms;
}
function addRoomTimeLimit(hr = 2) {
  const time = new Date();
  let t = time.getTime() + (hr * 60 * 60 * 1000);
  // console.log(t," current time", time.getTime())
  return t;
}
module.exports = router;
