const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const member_Controller = require('../controllers/memberController');
const csrfProtected = csrf();
router.use(csrfProtected);


// ------------------------Nếu đằng nhâp thì được phép------------------------
//Get Profile
router.get('/tai-khoan', member_Controller.isLoggedIn, member_Controller.get_profile);

//get method logout
router.get('/thoat', member_Controller.isLoggedIn, member_Controller.get_logout);

//===================================router chặn giưa 2 phương thức============================================//
router.use('/', member_Controller.notLogin_use);
//=========================================================================================================//


// -------------------Chưa đăng nhập thì được phép--------------------
//Require Controller module
/* GET Member Register. */
router.get('/dang-ky', member_Controller.notLoggedIn, member_Controller.get_register);

/* POST Member Register. */
router.post('/dang-ky', member_Controller.post_register);

//Get login
router.get('/dang-nhap', member_Controller.notLoggedIn, member_Controller.get_login);

//Post login
router.post('/dang-nhap',member_Controller.post_login);
//-------------------Login mxh------------
//login facebook
router.get('/facebook', member_Controller.get_facebook_login);

//login facebook callback login
router.get('/facebook', member_Controller.get_facebook_login_callback);



module.exports = router;
