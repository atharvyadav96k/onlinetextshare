var express = require('express');
var router = express.Router();

var randomstring = require("randomstring");
const roomSchema = require('../schema/roomSchema');
const noteSchema = require('../schema/noteSchema');
const mongoose = require('mongoose');
const encryptor = require('simple-encryptor')("mother Father Father Mother");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getinroom/:name',async  function(req, res){
  const roomName = req.params.name;
  try{
    const data = await roomSchema.findOne({ name: roomName }).populate('notes');
    console.log(data.notes)
    if (data) {
      res.render('room', {success: true});
    } else {
      throw error("No Room Found");
    }
  }catch(error){
    res.render("room", {success: false});
  }
});
router.post('/createRoom', async function (req, res) {
  const { password, hr } = req.body;
  let isUniqueRoom = false;
  let name;
  let timeLimit;
  if (typeof hr == 'number') {
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
  } else {
    res.status(500).send({
      message: "time Data type is not number",
      success: false
    });
  }


});
router.post('/addingNote', authentication, async function (req, res) {
  const { roomName, name = 'note', note, password } = req.body;
  try {
    const findRoom = await roomSchema.findOne({ name: roomName });
    try {
      const newNote = new noteSchema({
        name: name,
        note: note
      })
      await newNote.save();
      findRoom.notes.push(newNote._id);
      await findRoom.save();
      console.log(newNote);
      res.status(200).send({ message: "Note Added Successfully", success: true })
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: `Note not added error: ${error}`, success: false })
    }
  } catch (error) {
    res.status(500).send({ message: `Error: ${error}`, success: false })
  }
});
router.post('/getIntoRoom/:name', async function (req, res) {
  const name  = req.params.name;
  try {
    const data = await roomSchema.findOne({ name: name }).populate('notes');
    if (data) {
      res.status(200).send({ data: data, success: true, message: "room data send successfully" })
    } else {
      res.status(500).send({ success: false, message: "Please enter valid room, either room is not created or it is expired" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: `Error : ${error}` });
    console.log(error.message)
  }
});
router.post('/updateNote', authentication,function (req, res) {
  res.send("updated")
})
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
async function authentication(req, res, next) {
  const { roomName, password } = req.body;
  try {
    const room = await roomSchema.findOne({ name: roomName });
    if (password == encryptor.decrypt(room.password)) {
      next();
    } else {
      res.status(500).send({ message: 'wrong password or room not found', success: false });
    }
  } catch (error) {
    res.status(500).send({message: `Error: ${error.message}`, success: false})
  }
  console.log(roomName, password)

}
module.exports = router;