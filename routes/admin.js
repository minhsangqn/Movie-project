const express = require('express'),
    csrf = require('csurf'),
    multer = require('multer');
const router = express.Router();
const auth_controller = require('../Controllers/admin/authController');
const csrfProtected = csrf();
router.use(csrfProtected);

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/images/image_avatar')
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname);
        // firstname + 'SANG' + Date.now()
    }
});

const upload = multer({storage:storage});

const storageBack = multer.diskStorage({
    destination: function(req,file,ck){
        ck(null,'./public/images/image_back')
    },
    filename: function(req,file,ck){
        ck(null,file.originalname)
        // firstname + 'SANG' + Date.now()
    }
});

const uploadBack = multer({storage:storageBack});

//======================================================================================//
router.get('/', auth_controller.isLoggedIn, auth_controller.get_dashboard);

//====================================ADD MOVIE=================================//
router.get('/upload', function (req,res) {
    res.render('admin/index/input', {
        pageTitle: req.__('UPLOAD FILE'),
        layout: false,
        csrfToken: req.csrfToken(),
    });
});
router.post('/upload',uploadBack.any(), function (req,res){
    console.log(req.file);
    res.send("UPLOAD SUCCES");
    res.render('admin/index/input',{img: req.file.file,layout: false})
});

router.get('/addMovie', auth_controller.get_addMovie);

router.post('/addBack',uploadBack.any('episode_back'), function (req,res,next) {
    console.log(req.file);
});

router.post('/addMovie', upload.any(), function(req, res, next) {
    // console.log(req.files);
    // res.send("UPLOAD THANH CONG: "+ req.files[0].filename + "ID: "+ req.files[1].filename);
    const episode_id = req.body.episode_id;
    const episode_name = req.body.episode_name;
    const episode_film = req.body.episode_film;
    const episode_info = req.body.episode_info;
    const year_id = req.body.year_id;
    const cat_id = req.body.cat_idList;
    const episode_hide = req.body.episode_hide;
    const episode_back =  req.files[0].filename;
    const episode_image = req.files[1].filename;
    const episode_season = req.body.episode_season;

    if(!episode_season+!episode_image+!episode_id + !episode_name +!episode_film + !episode_info +!year_id +!cat_id +!episode_hide){
        req.flash('err', 'Vui lòng nhập đầy đủ dữ liệu');
        res.redirect('/admin/addMovie');
    }else {
        auth_controller.post_addMovie(episode_season,episode_back,episode_image,episode_id,episode_name,episode_film,episode_info,year_id,cat_id,episode_hide)
            .then(result =>{
                console.log('1');
                req.flash('success',result.msg);
                res.redirect('/admin/listMovie');
            })
            .catch(err =>{
                console.log('2');
                req.flash('err',err.err);
                res.redirect('/admin/addMovie');
            });
    }
});

router.get('/listMovie', auth_controller.get_listMovie);

router.get('/editMovie/:episode_name_ascii/:episode_id',(req,res) => {

    const episode_id = req.param('episode_id');
    const episode_name_ascii = req.param('episode_name_ascii');
    auth_controller.get_editMovie(episode_id)
        .then(result =>{
            console.log("CAT: "+ result);
            res.render('admin/index/listMovie/editMovie', {
                err: req.flash('err'),
                success: req.flash('success'),
                layout:false,
                pageTitle: req.__(episode_name_ascii),
                csrfToken: req.csrfToken(),
                item:result.item});
        })
        .catch(err => {
            console.log('2');
            req.flash('err', err.err);
            res.redirect('admin/editMovie');
        });
});

//post edit movie
router.post('/editMovie',(req,res) =>{
    const episode_name_ascii = req.body.episode_name_ascii;
    const id = req.body._id;
    const episode_id = req.body.episode_id;
    const episode_name = req.body.episode_name;
    const episode_film = req.body.episode_film;
    const episode_info = req.body.episode_info;
    const year_id = req.body.year_id;
    const cat_id = req.body.cat_idList;
    const episode_hide = req.body.episode_hide;
    const episode_season = req.body.episode_season;

    // console.log('episode_name_ascii: '+episode_name_ascii);
    // console.log('id: '+id);
    // console.log('episode_id: '+episode_id);
    // console.log('episode_season: '+episode_season);
    // console.log('episode_name: '+episode_name);
    // console.log('episode_film: '+episode_film);
    // console.log('episode_info: '+episode_info);
    // console.log('year_id: '+year_id);
    // console.log('cat_id: '+cat_id);
    // console.log('episode_hide: '+episode_hide);

    if(!episode_season + !episode_name +!episode_film + !episode_info +!year_id +!cat_id +!episode_hide){
        req.flash('err', 'Vui lòng nhập đầy đủ dữ liệu');
        res.redirect('/admin/editMovie/' + episode_name_ascii +'/'+ episode_id);
    }else {
        auth_controller.post_editMovie(id,episode_id,episode_name,episode_film,episode_season,episode_info,year_id,cat_id,episode_hide)
            .then(result =>{
                console.log('1');
                req.flash('success',result.msg);
                res.redirect('/admin/listMovie');
            })
            .catch(err =>{
                console.log('2');
                req.flash('err',err.err);
                res.redirect('/admin/editMovie/' + episode_name_ascii +'/'+ episode_id);
            });
    }
});
router.get('/deleteMovie/:episode_id', (req, res) => {

    const episode_id = req.param('episode_id');
    // console.log(episode_id);
    auth_controller.get_delectMovie(episode_id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/listMovie');
        })
        .catch(err =>{
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/listMovie');
        });
});
//====================================END ADD MOVIE==============================//

//=================================ADD YEAR======================================//
//em chua bo check vao
router.get('/addYear', auth_controller.get_addYear);

router.post('/addYear', function (req, res,next) {
    const year_id = req.body.year_id;
    const year_name = req.body.year_name;

    if(!year_id || !year_name){
        req.flash('err','ID hoặc Năm phát hành bị trống');
        res.redirect('/admin/addYear');
    }else{
        auth_controller.post_addYear(year_id, year_name)
            .then(result =>{
                req.flash('success', result.msg);
                res.redirect('/admin/listYear');
            })
            .catch(err => {
                req.flash('err', err.err);
                res.redirect('/admin/addYear');
            });
    }
});

router.get('/listYear', auth_controller.isLoggedIn, auth_controller.get_listYear);

router.get('/editYear/:year_id', (req, res) =>{
    const year_id = req.param('year_id');
    auth_controller.get_editYear(year_id)
        .then(result =>{
            res.render('admin/index/listYear/editYear', {
                err: req.flash('err'),
                success: req.flash('success'),
                layout:false,
                pageTitle: req.__('Sửa năm phát hành'),
                csrfToken: req.csrfToken(),
                item:result.item})
        })
        .catch(err => {
            req.flash('err', err.err);
            res.redirect('admin/index/listYear/editYear');
        });

});
// router.get('/edityear', auth_controller.get_editYear);
router.post('/editYear', (req, res) => {
    const year_id = req.body.year_id;
    const year_name = req.body.year_name;
    const id = req.body._id;


    auth_controller.post_edityear(year_id, year_name, id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/listYear');
        })
        .catch(err => {
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/editYear/' + year_id);
        });
});

router.get('/deleteYear/:_id', (req, res) => {
    const id = req.param('_id');
    console.log(id);
    auth_controller.get_delectYear(id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/listYear');
        })
        .catch(err =>{
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/listYear');
        });
});
//=================================END ADD YEAR==================================//
//=================================ADD TYPE=======================================//
router.get('/addCat', auth_controller.get_addCat);

router.post('/addCat', function (req, res,next) {
    const cat_id = req.body.cat_id;
    const cat_name_title = req.body.cat_name_title;
    // var cat_name_ascii = req.body.cat_name_ascii;
    console.log(cat_id+cat_name_title);
    if(!cat_id || !cat_name_title){
        req.flash('err','Vui lòng nhập đầy đủ dữ liệu');
        res.redirect('/admin/addCat');
    }else{
        auth_controller.post_addCat(cat_id,cat_name_title)
            .then(result =>{
                req.flash('success', result.msg);
                res.redirect('/admin/listCat');
            })
            .catch(err => {
                req.flash('err', err.err);
                res.redirect('/admin/addCat');
            });
    }
});

router.get('/listCat', auth_controller.get_listCat);

router.get('/editCat/:cat_id', (req, res) =>{
    const cat_id = req.param('cat_id');

    auth_controller.get_editCat(cat_id)
        .then(result =>{
            console.log('res');
            res.render('admin/index/listCatalog/editCat', {
                err: req.flash('err'),
                success: req.flash('success'),
                layout:false,
                pageTitle: req.__('Sửa năm Thể loại'),
                csrfToken: req.csrfToken(),
                item:result.item})
        })
        .catch(err => {
            console.log('err');
            req.flash('err', err.err);
            res.redirect('/admin/listCat');
        });

});
router.post('/editCat', (req, res) => {
    const cat_id = req.body.cat_id;
    const cat_name_title = req.body.cat_name_title;
    // var cat_name_ascii = req.body.cat_name_ascii;
    const id = req.body._id;
    auth_controller.post_editCat(cat_id, cat_name_title,id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/listCat');
        })
        .catch(err => {
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/editCat/' + cat_id);
        });
});

router.get('/deleteCat/:_id', (req, res) => {
    const id = req.param('_id');
    console.log(id);
    auth_controller.get_delectCat(id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/listCat');
        })
        .catch(err =>{
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/listCat');
        });
});
//=================================END ADD TYPE=====================================//
//===================================ADD CHAPTER=====================================//

router.get('/chapter/:episode_id/:_id', (req,res) => {
    const chapter_id = req.param('episode_id');
    const _id = req.param('_id');

    auth_controller.get_addChapter(chapter_id,_id)
        .then(result =>{
            res.render('admin/index/Chapter/addChapter', {
                err: req.flash('err'),
                success: req.flash('success'),
                layout:false,
                pageTitle: req.__('Thêm tập mới'),
                csrfToken: req.csrfToken(),
                item:result.item})
        })
        .catch(err => {
            req.flash('err', err.err);
            res.redirect('admin/index/Chapter/addChapter');
        });
});

router.post('/chapter', (req,res) =>{
    // var episode_name_ascii = req.body.episode_name_ascii;
    const chapter_id = req.body.chapter_id;
    const idMovie = req.body._id;
    const chapter_url = req.body.chapter_url;
    const chapter_num = req.body.chapter_num;
    console.log(chapter_id+"/"+idMovie+"/"+chapter_url+"/"+chapter_num);
    if(!chapter_url+ !chapter_num){
        req.flash('err','Vui lòng nhập đầy đủ dữ liệu');
        res.redirect('/admin/chapter/' + chapter_id +'/'+ idMovie);
    }else{
        auth_controller.post_addChapter(chapter_id, idMovie, chapter_url,chapter_num)
            .then(result =>{
                console.log('1');
                req.flash('success', result.msg);
                res.redirect('/admin/chapter/' + chapter_id +'/'+ idMovie);
            })
            .catch(err => {
                console.log('2');
                req.flash('err', err.err);
                res.send("loi");
                res.redirect('/chapter' );
            });
    }
});

router.get('/deleteChapter/:chapter_id/:_id/:listEpisode', (req, res) => {
    const id = req.param('_id');
    const idMovie = req.param('listEpisode');
    const chapter_id = req.param('chapter_id');
    console.log(id+"/"+idMovie+"/"+chapter_id);

    auth_controller.get_deleteChapter(id,idMovie)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            req.flash('err', result.err);
            res.redirect('/admin/chapter/' + chapter_id +'/'+ idMovie);
        })
        .catch(err =>{
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/chapter/' + chapter_id +'/'+ idMovie);
        });
});

router.get('/editChapter/:chapter_id/:_id/:listEpisode', (req, res) =>{
    const chapter_id = req.param('chapter_id');
    const idMovie = req.param('listEpisode');
    const id = req.param('_id');
    auth_controller.get_editChap(chapter_id)
        .then(result =>{
            res.render('admin/index/Chapter/editChapter', {
                err: req.flash('err'),
                success: req.flash('success'),
                layout:false,
                pageTitle: req.__('Sửa năm tập'),
                csrfToken: req.csrfToken(),
                item:result.item})
        })
        .catch(err => {
            req.flash('err', err.err);
            res.redirect('/admin/chapter/' + chapter_id +'/'+ idMovie);
        });

});
router.post('/editChapter', (req, res) => {
    const chapter_url = req.body.chapter_url;
    const chapter_num = req.body.chapter_num;
    const episode_id = req.body.episode_id;
    const chapter_id = req.body.chapter_id;
    const id = req.body._id;
    console.log("ID: "+chapter_url+chapter_num+episode_id);

    auth_controller.post_editChapter(chapter_url, chapter_num,id)
        .then(result =>{
            console.log('1');
            req.flash('success', result.msg);
            res.redirect('/admin/chapter/'+ chapter_id + '/'+episode_id);
        })
        .catch(err => {
            console.log('2');
            req.flash('err', err.err);
            res.redirect('/admin/chapter/'+ chapter_id + '/'+episode_id);
        });
});
//=================================END ADD CHAPTER=====================================//
router.get('/logout', auth_controller.isLoggedIn, auth_controller.get_Logout);

//Not login to dashboard
router.use('/', auth_controller.notLogin_use);

router.get('/login', auth_controller.checkLoginAdmin, auth_controller.login_get);

router.post('/login', auth_controller.login_post);

module.exports = router;