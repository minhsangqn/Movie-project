var validator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var settings = require('../config/settings');
var Member = require('../modules/member');
var cfgAuth = require('./auth');

var provider = null;

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, member) {

        var newMember = member.toObject();
        newMember['provider'] = provider;
        done(err, newMember);
    });
});

// Passport register
passport.use('local.register', new LocalStrategy({
    usernameField: 'email', // Tên của input dùng đăng nhập
    passwordField: 'password', // tên của input mật khẩu
    passReqToCallback: true
}, function(req, email, password, done) {
    // Validator các input từ trang đăng ký
    req.checkBody('firstname', req.__('Vui lòng nhập tên.')).notEmpty();
    req.checkBody('lastname', req.__('Vui lòng nhập họ.')).notEmpty();
    req.checkBody('email', req.__('Địa chỉ email không hợp lệ, vui lòng kiểm tra lại.')).notEmpty().isEmail();
    req.checkBody('password', req.__('Mật khẩu không hợp lệ, mật khẩu phải có ít nhất %d ký tự trở lên', settings.passwordLength)).notEmpty().isLength({
        min: settings.passwordLength
    });
    req.checkBody('password', req.__('Xác nhận mật khẩu không giống nhau, vui lòng kiểm tra lại.')).equals(req.body.confirmpassword);
    req.checkBody('accept', req.__('Bạn phải chấp nhận các điều khoản của chúng tôi để tiếp tục.')).equals("1");

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    Member.findOne({
        'local.email': email
    }, function(err, member) {
        if (err) {
            return done(err);
        }
        if (member) {
            return done(null, false, {
                message: req.__('Địa chỉ email được sử dụng, vui lòng nhập một email khác.')
            });
        }
        var newMember = new Member();
        newMember.info.firstname = req.body.firstname;
        newMember.info.lastname = req.body.lastname;
        newMember.local.email = req.body.email;
        newMember.local.password = newMember.encryptPassword(req.body.password);
        newMember.newsletter = req.body.newsletter;
        newMember.roles = 'MEMBER';
        // Nếu yêu cầu kích hoạt tài khoản qua email thì trạng thái tài khoản là INACTIVE
        newMember.status = (settings.confirmRegister == 1) ? 'INACTIVE' : 'ACTIVE';

        newMember.save(function(err, result) {
            if (err) {
                return done(err);
            } else {
                // Nếu yêu cầu kích hoạt tài khoản qua email thì chỉ đăng ký mà không tự động đăng nhập
                if (settings.confirmRegister == 1) {
                    return done(null, newMember);
                } else {
                    // Tự động đăng nhập cho thành viên mới đăng ký khi không yêu cầu kích hoạt tài khoản qua email
                    req.logIn(newMember, function(err) {
                        provider = 'local';
                        return done(err, newMember);
                    });
                }
            }
        });
    });
}));

// Passport Login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email', // Tên của input dùng đăng nhập
    passwordField: 'password', // tên của input mật khẩu
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', req.__('Địa chỉ email không hợp lệ, vui lòng thử lại.')).notEmpty().isEmail();
    req.checkBody('password', req.__('Sai mật khẩu. Xin vui lòng thử lại.')).notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    // Check member input
    Member.findOne({
        'local.email': email
    }, function(err, member) {
        if (err) {
            return done(err);
        }

        if (!member) {
            return done(null, false, {
                message: req.__('Không tìm thấy thành viên!')
            });
        }

        if (!member.validPassword(password)) {
            return done(null, false, {
                message: req.__('Mật khẩu không chính xác, vui lòng thử lại.')
            });
        };

        if (member.isInActivated(member.status)) {
            return done(null, false, {
                message: req.__('Tài khoản của bạn không hoạt động')
            });
        }

        if (member.isSuspended(member.status)) {
            return done(null, false, {
                message: req.__('Tài khoản của bạn bị tạm ngưng')
            });
        }

        provider = "local";
        return done(null, member);

    });

}));

// Passport Facebook Login
passport.use(new FacebookStrategy({
    clientID: cfgAuth.facebookAuth.clientID,
    clientSecret: cfgAuth.facebookAuth.clientSecret,
    callbackURL: cfgAuth.facebookAuth.callbackURL,
    profileFields: cfgAuth.facebookAuth.profileFields,
    passReqToCallback: true
}, function(req, token, refreshTonken, profile, done) {

    // Check exist account
    Member.findOne({
        'facebook.id': profile.id
    }, function(err, member) {
        if (err) {
            return done(err);
        }

        if (member) {
            provider = "facebook";
            return done(null, member);
        } else {
            // Link facebook to local account
            Member.findOne({
                'local.email': profile.emails[0].value
            }, function(err, member) {

                if (err) {
                    return done(err);
                }

                if (member) {
                    // Update exist account
                    Member.findOneAndUpdate({
                        'local.email': profile.emails[0].value
                    }, {
                        'facebook.id': profile.id,
                        'facebook.token': token,
                        'facebook.email': profile.emails[0].value,
                        'facebook.name': profile._json.first_name + ' ' + profile._json.last_name,
                        'facebook.photo': 'https://graph.facebook.com/v2.9/' + profile.id + '/picture?type=large'
                    }, {
                        new: true
                    }, function(err, member) {
                        if (err) {
                            return done(err);
                        }
                        provider = "facebook";
                        return done(null, member);
                    });
                } else {

                    // Link facebook to google account
                    Member.findOne({
                        'google.email': profile.emails[0].value
                    }, function(err, member) {

                        if (err) {
                            return done(err);
                        }

                        if (member) {
                            // Update exist account
                            Member.findOneAndUpdate({
                                'google.email': profile.emails[0].value
                            }, {
                                'facebook.id': profile.id,
                                'facebook.token': token,
                                'facebook.email': profile.emails[0].value,
                                'facebook.name': profile._json.first_name + ' ' + profile._json.last_name,
                                'facebook.photo': 'https://graph.facebook.com/v2.9/' + profile.id + '/picture?type=large'
                            }, {
                                new: true
                            }, function(err, member) {
                                if (err) {
                                    return done(err);
                                }
                                provider = "facebook";
                                return done(null, member);
                            });
                        } else {
                            // add new account with facebook info
                            var newMember = new Member();
                            newMember.facebook.id = profile.id;
                            newMember.facebook.token = token;
                            newMember.facebook.email = profile.emails[0].value;
                            newMember.facebook.name = profile._json.first_name + ' ' + profile._json.last_name;
                            newMember.facebook.photo = 'https://graph.facebook.com/v2.9/' + profile.id + '/picture?type=large';
                            newMember.roles = "MEMBER";
                            newMember.status = "ACTIVE";
                            newMember.save(function(err) {
                                if (err) {
                                    return done(err);
                                }
                                provider = "facebook";
                                return done(null, newMember);
                            });
                        }
                    });

                }
            });

        }
    });
}));

// Passport Google Login
passport.use(new GoogleStrategy({
    clientID: cfgAuth.googleAuth.clientID,
    clientSecret: cfgAuth.googleAuth.clientSecret,
    callbackURL: cfgAuth.googleAuth.callbackURL,
    passReqToCallback: true
}, function(req, token, refreshTonken, profile, done){

    //check exist account
    Member.findOne({
        'google.id': profile.id
    }, function(err, member) {
        if (err) {
            return done(err);
        }

        if (member) {
            provider = "google";
            return done(null, member);
        } else {

            Member.findOne({
                'local.email': profile.emails[0].value
            }, function(err, member) {
                if (err) {
                    return done(err);
                }

                if (member) {
                    //Link google account to local account
                    Member.findOneAndUpdate({
                        'local.email': profile.emails[0].value
                    }, {
                        'google.id': profile.id,
                        'google.token': token,
                        'google.name': profile.displayName,
                        'google.email': profile.emails[0].value,
                        'google.photo': profile.photos[0].value
                    }, {
                        new: true
                    }, function(err, member) {
                        if (err) {
                            return done(err);
                        }
                        provider = "google";
                        return done(null, member);
                    });
                } else {
                    Member.findOne({
                        'facebook.email': profile.emails[0].value
                    }, function(err, member) {
                        if (err) {
                            return done(err);
                        }

                        if (member) {
                            //Link google account to local account
                            Member.findOneAndUpdate({
                                'facebook.email': profile.emails[0].value
                            }, {
                                'google.id': profile.id,
                                'google.token': token,
                                'google.name': profile.displayName,
                                'google.email': profile.emails[0].value,
                                'google.photo': profile.photos[0].value
                            }, {
                                new: true
                            }, function(err, member) {
                                if (err) {
                                    return done(err);
                                }
                                provider = "google";
                                return done(null, member);
                            });
                        } else {
                            //Add new account using google email
                            var newMemmber = new Member();
                            newMemmber.google.id = profile.id;
                            newMemmber.google.token = token;
                            newMemmber.google.name = profile.displayName;
                            newMemmber.google.email = profile.emails[0].value;
                            newMemmber.google.photo = profile.photos[0].value;
                            newMemmber.roles = "MEMBER";
                            newMemmber.status = "ACTIVE";
                            newMemmber.save(function(err) {
                                if (err) { return done(err); }
                                provider = "google";
                                return done(null, newMemmber);
                            });
                        }

                    });
                }

            });

        }
    });

}));

// Passport Admin
passport.use('admin.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {

    req.checkBody('email', req.__('Địa chỉ email không hợp lệ, vui lòng kiểm tra lại')).notEmpty().isEmail();
    req.checkBody('password', req.__('Vui lòng nhập mật khẩu của bạn')).notEmpty();
    req.checkBody('pin_code', req.__('Vui lòng nhập mã pin của bạn')).notEmpty();

    var errrors = req.validationErrors();

    if (errrors) {
        var messages = [];
        errrors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    // Find member
    Member.findOne({
        'local.email': email,
        'roles' : 'ADMIN'
    }, function(err, member) {
        if (err)
            return done(err);

        if (!member) {
            return done(null, false, {
                message: req.__('Tài khoản này không tồn tại, vui lòng kiểm tra lại.')
            });
        }

        if (!member.validPassword(password)) {
            return done(null, false, {
                message: req.__('Mã pin của bạn không hợp lệ, vui lòng nhập lại.')
            });
        }

        if (!member.validPinCode(req.body.pin_code)) {
            return done(null, false, {
                message: req.__('Mã pin của bạn không hợp lệ, vui lòng nhập lại.')
            });
        }

        if (req.body.pin_code == null){
            return done(null, true, {
                message: req.__('Mã pin không tồn tại.')
            });
        }

        if (!member.isGroupAdmin(member.roles)) {
            return done(null, false, {
                message: req.__('Bạn không đăng nhập quyền truy cập vào bảng điều khiển quản trị viên, vui lòng quay lại trang chủ.')
            });
        }

        if (member.isInActivated(member.status)) {
            return done(null, false, {
                message: req.__('Tài khoản của bạn chưa được kích hoạt.')
            });
        }

        if (member.isSuspended(member.status)) {
            return done(null, false, {
                message: req.__('Tài khoản của bạn bị khóa.')
            });
        }

        provider = "admin";
        return done(null, member);

    });
}));