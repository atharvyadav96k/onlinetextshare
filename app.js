var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Adding websocket to project
const socketIo = require('socket.io');
const http =  require('http')
var indexRouter = require('./routes/index');

var app = express();
const server = http.createServer(app);
const io = socketIo(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



io.on('connection', (socket)=>{
  console.log('new user')
  socket.on('joinRoom', (roomName)=>{
    socket.join(roomName);
    console.log(`user connect to room ${roomName}`)
  })
})



app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
