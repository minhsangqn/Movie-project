const passport = require('passport');

exports.get_register = function (req, res, next) {
    const messages = req.flash('error');
    res.render('frontend/member/register',{
        pageTitle: req.__('Đăng ký thành viên'),
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
};
//POST register
exports.post_register =  passport.authenticate('local.register',{
    successRedirect: '/thanh-vien/tai-khoan',
    failureRedirect: '/thanh-vien/dang-ky',
    badRequestMessage: 'Các trường điều bắt buộc',
    failureFlash: true
});
// Get Profile
exports.get_profile = function (req,res, next) {
    res.render('frontend/member/dashboard', {
        pageTitle: req.__('Thông tin thành viên')
    });
};
// GET Login
exports.get_login = function(req, res, next) {
    const messages = req.flash('error');
    console.log('err: '+ messages);
    res.render('frontend/member/login', {
        pageTitle: req.__('Thành viên đăng nhập'),
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
};

// POST Login
exports.post_login = passport.authenticate('local.login', {
    successRedirect: '/thanh-vien/tai-khoan',
    failureRedirect: '/thanh-vien/dang-nhap',
    badRequestMessage: 'Các trường điều bắt buộc',
    failureFlash: true
});

//Method logout
exports.get_logout = function(req, res, next){
  req.logOut();
  res.redirect('/');
};

//Get Facebook
exports.get_facebook_login = passport.authenticate('facebook', {
    scope: 'email'
});
//Get Facebook callback
exports.get_facebook_login_callback = passport.authenticate('facebook', {
    successRedirect: '/thanh-vien/tai-khoan',
    failureRedirect: '/thanh-vien/dang-nhap'
});

//--------------------khoi tao cac phuong thuc----------------------------

exports.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return  next();
    }
    res.redirect('/thanh-vien/dang-nhap');
};
exports.notLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/thanh-vien/tai-khoan');
};

exports.notLogin_use = function (req, res, next) {
    next();
};