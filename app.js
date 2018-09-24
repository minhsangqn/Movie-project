const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const logger = require('morgan');
const expHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const settings = require('./config/settings');
const database = require('./config/database');
const index = require('./routes/index');
const routeMember = require('./routes/member');
const routeAdmin = require('./routes/admin');
const routerAPI = require('./routes/API');
const app = express();
//creater server
const server = require("http").createServer(app);
const port        = process.env.PORT || 5000;
const io = require("socket.io")(server);
const controll = require("./Controllers/admin/authController");

//SOCKET IO
//
// var chat = io.on('connection', function (socket) {
//     console.log("co 1 ket noi: "+ socket.id);
//     socket.on('news', function (msg) {
//         console.log('Nhan');
//         var res = controll.fetch_data();
//         console.log(res);
//         chat.emit('news', res);
//         console.log('da phat');
//     });
//
//     // socket.emit('news', 'ket noi');
// });
io.on('connection', function (socket) {
    console.log("co 1 ket noi: "+ socket.id);
    //console.log(socket.adapter.rooms);//show danh sach room dang co,join:vao room,leave: thoat room
    socket.on('ID_User', async function (data) {
        var ArrayUser = [];
        if (ArrayUser.indexOf(data)<0){
            socket.IDUser = data;
            console.log("DATA: "+socket.IDUser);
            if(data !== null){
                console.log("vao");
                ArrayUser.push(data);
                //lay user trong database
                var UserData = await controll.fetch_dataNoti();
                console.log("UserData: "+JSON.stringify(UserData));
                var User = JSON.stringify(UserData);
                for (var i = 0;i<UserData.length;i++){
                    var IDUs = UserData[i].id_user_notifi;
                    console.log("IDUs: "+IDUs);
                }

            }
        }
    });

});

//end create server
mongoose.connect(database.dbStr);
mongoose.connection.on('error', function(err) {
    console.log('Error connect to Database: ' + err);
});

require('./config/passport');
//
// // view engine setup
const hbsConfig = expHbs.create({
    helpers: require('./helpers/handlebars.js').helpers,
    layoutsDir:  path.join(__dirname, '/templates/'+ settings.defaultTemplate +'/layouts'),
    defaultLayout: path.join(__dirname, '/templates/' + settings.defaultTemplate +'/layouts/layout'),
    partialsDir: path.join(__dirname, '/templates/' + settings.defaultTemplate +'/partials'),
    extname: '.hbs',
});


app.engine('.hbs', hbsConfig.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/templates/'+ settings.defaultTemplate));

app.use(logger('dev'));
app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));

app.use(express.static(path.join(__dirname, 'public')));

//da ngon ngu
i18n.configure({
    locales: ['en', 'vi'],
    register: global,
    fallback: { 'vi': 'en' },
    cookie: 'language', // Tên của cookie trên browser nhé
    queryParameter: 'lang', // Đây là params trên url dùng thay đổi ngôn ngữ
    defaultLocale: 'en', //Ngôn ngữ mặc định khi init nó sẽ tự tìm các chuỗi nằm trong hàm __ và __n để tự thêm vào file json
    directory: __dirname + '/languages',
    directoryPermissions: '755', // Thiết lập quyền ghi cho các file ngôn ngữ (chỉ dùng cho hệ thống nodejs trên linux)
    autoReload: true,
    updateFiles: true,
    api: {

        '__': '__', // Đây là 2 hàm dùng trong template dịch ngôn ngữ nhé. Các bạn cũng có thể thay đổi tên của nó (nên để mặc địch)
        '__n': '__n'
    }
});
app.use(session({secret: settings.secured_key, resave: false,saveUninitialized: false}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req,res,next) {
    i18n.init(req,res,next);
});

//cau hinh mac dinh
app.use(function(req, res, next) {
    res.locals.clanguage = req.getLocale(); // Ngôn ngữ hiện tại
    res.locals.languages = i18n.getLocales(); // Danh sách ngôn ngữ khai báo trong phần cấu hình bên trên.
    res.locals.settings = settings;
    res.locals.logged = req.isAuthenticated();
    res.locals.member = req.user;
    next();
});

const getIP = require('ipware')().get_ip;
app.use(function(req, res, next) {
    const ipInfo = getIP(req);
    // console.log("IP: "+ipInfo.clientIp);
    // { clientIp: '127.0.0.1', clientIpRoutable: false }
    next();
});


//khai bao router
app.use('/', index);
app.use('/thanh-vien', routeMember);
app.use('/admin', routeAdmin);
app.use('/API', routerAPI);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
module.exports = app;
