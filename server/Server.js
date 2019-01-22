var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const port = process.env.PORT || 4001;
var server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', indexRouter);
server.use('/users', usersRouter);

const io = socketIo(server); // < Interesting!

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on("connection", socket => {
    console.log("New client connected");
    setInterval(() => getApiAndEmit(socket), 10000);
    socket.on('register', handleRegister);

    socket.on('join', handleJoin);

    socket.on('leave', handleLeave);

    socket.on('message', handleMessage);

    socket.on('chatrooms', handleGetChatrooms);

    socket.on('availableUsers', handleGetAvailableUsers);

    socket.on('disconnect', function () {
        console.log('client disconnect...', socket.id);
        handleDisconnect()
    });

    socket.on('error', function (err) {
        console.log('received error from client:', socket.id);
        console.log(err)
    })
});

const getApiAndEmit = async socket => {
    try {
        // const res = await axios.get(
        //     "https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
        // );
        let tempu = Math.floor(Math.random() * 1000) + 1;
        socket.emit("FromAPI", {response: tempu});
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};
server.listen(port, () => console.log('Listening on port ${port}'));

function handleRegister(userName, callback) {
    if (!clientManager.isUserAvailable(userName))
        return callback('user is not available');

    const user = clientManager.getUserByName(userName);
    clientManager.registerClient(client, user);

    return callback(null, user)
}

module.exports = server;
