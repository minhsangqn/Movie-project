var episode = require("../../modules/table_episode");
var passport = require('passport');
var year = require("../../modules/table_year");
var cat = require("../../modules/table_cat");
var catEpi = require("../../modules/table_catepi");
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');
var filePath = './public/images/image_avatar/';
var chapter = require("../../modules/table_chapter");
var slug = require('vietnamese-slug');
exports.get_dashboard = function(req, res, next){
    res.render('admin/dashboard', {
        pageTitle: req.__('Bảng điều khiển'),
        layout: false
    });
};
//=============================================ADD MOVIE=======================================//

exports.get_addMovie = function (req, res, next) {
    res.render('admin/index/ListMovie/addMovie', {
        pageTitle: req.__('Thêm mới phim'),
        csrfToken: req.csrfToken(),
        layout:false,
        success: req.flash('success'),
        err: req.flash('err')
    });
};

exports.post_addMovie = (episode_season,episode_back,episode_image,episode_id,episode_name,episode_film,episode_info,year_id,cat_id,episode_hide) =>
    new Promise((resolve, reject) => {
        episode.findOne({"episode_id": episode_id})
            .then(epi =>{
                if(epi){
                    console.log('1.1');
                    reject({status: 400, err:"Trùng ID! Vui lòng nhập lại ID khác."});
                }else{
                    var arr = cat_id.split(',');
                    console.log(cat_id);
                    console.log('1.2');
                    var d = new Date();
                    var timeStamp = d.getTime();
                    var MovieNew = new episode({
                        episode_id : episode_id,
                        episode_name: episode_name,
                        episode_name_ascii: slug(episode_name),
                        episode_film: episode_film,
                        episode_view: '1',
                        episode_info: episode_info,
                        episode_hide: episode_hide,
                        episode_image: episode_image,
                        episode_back:episode_back,
                        create_at: timeStamp,
                        episode_season:episode_season
                    });
                    MovieNew.save(function (err) {
                        console.log("ARR PUSH LIST: "+arr);
                        episode.findByIdAndUpdate({"_id": ObjectId(MovieNew._id)},{$push: {"listEpisode": arr,"year_order": year_id}},
                            {safe: true, upsert: true, new: true,multi: true},
                            function (err) {
                                console.log("ADD list");
                                resolve({status: 201, msg: "Tạo mới thành công!"});
                            })
                    });
                    cat.update({_id:{$in: arr}},{$push: {"listEpisode": MovieNew._id}},
                        {safe: true, upsert: true, new: true,multi: true},
                        function (err) {
                            console.log("Cread Category");
                            resolve({status: 201, msg: "Tạo mới thành công!"});
                        });

                    // .then(() =>{
                    //      episode.findByIdAndUpdate({"_id": ObjectId(MovieNew._id)},{$push: {"listEpisode": arr,"year_order": year_id}},
                    //          {safe: true, upsert: true, new: true},
                    //          function (err) {
                    //              console.log("ADD list");
                    //              resolve({status: 201, msg: "Tạo mới thành công!"});
                    //          })
                    //
                    //  })
                    // .catch(err =>{
                    //     console.log('1.5');
                    //     reject({status: 500, err: "Lỗi Server !"});
                    // })
                }
            })
            .catch(err =>{
                console.log('1.5');
                reject({status: 500, err: "Lỗi Server !"});
            });
    });

exports.get_listMovie = function(req, res, next){
    episode.find().sort({_id: -1})
        .then(function(doc){
            res.render('admin/index/listMovie/listMovie', {
                pageTitle: req.__('Danh sách phim'),
                csrfToken: req.csrfToken(),
                layout:false,
                item:doc,
                success: req.flash('success'),
                err: req.flash('err')
            });
        });
};

exports.get_editMovie = (episode_id) =>
    new Promise((resolve, reject) =>{
        episode.findOne({"episode_id": episode_id})
            .then(episo => {
                if(episo.length === 0){
                    console.log("1.1");
                    reject({status:  404, err: 'ID không tồn tại!'});
                }else{
                    console.log("DU LIEU: "+ episo.listEpisode);
                    resolve({status: 200, item:episo});
                }
            })
            .catch(err =>{
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.post_editMovie = (id,episode_id,episode_name,episode_film,episode_season,episode_info,year_id,cat_id,episode_hide) =>
    new Promise((resolve, reject) => {
        episode.findOne({'episode_id':episode_id})
            .then(() =>{
                // console.log("1");
                var arr = cat_id.split(',');
                episode.findByIdAndUpdate({'_id': ObjectId(id)},
                    {$set: {episode_season: episode_season,episode_name:episode_name,episode_name_ascii: slug(episode_name),episode_film,episode_info:episode_info,episode_hide:episode_hide,"listEpisode":arr,"year_order": year_id}})
                    .then(() =>{
                        for (var i = 0; i<arr.length;i++){
                            cat.findByIdAndUpdate({'_id':ObjectId(arr[i])},{$set:{"listEpisode":id}})
                                .then(() =>{
                                    console.log("1");
                                    resolve({status: 200, msg: "Cập nhật thành công !"});
                                })
                                .catch(err =>{
                                    reject({status: 500, err: "Thất bại !"});
                                })
                        }
                        resolve({status: 200, msg: "Cập nhật thành công !"});
                    })
                    .catch(err =>{
                        console.log('1.2');
                        reject({status: 500, err: "Thất bại !"});
                    })
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.get_delectMovie = id =>
    new Promise((resolve, reject) => {
        console.log('id: '+id);
        episode.findByIdAndRemove({'_id': ObjectId(id)})

            .then(doc => {
                console.log('LOG: '+doc.episode_order);
                const idChapter = doc.episode_order;
                const episode_back = doc.episode_back;
                const episode_image = doc.episode_image;
                fs.unlinkSync(filePath+episode_image);
                fs.unlinkSync(filePath+episode_back);

                for (var i = 0; i<idChapter.length;i++){
                    chapter.findByIdAndRemove({'_id': ObjectId(idChapter[i])}, function (err) {
                        console.log('dele Chapter');
                        resolve({status: 200, msg: "Đã xóa chapter!"});
                    });
                }

                year.update({},{$pull: {year_order: ObjectId(id)}}, {multi: true})
                    .then(()=>{
                        cat.update({},{$pull: {listEpisode: ObjectId(id)}}, {multi: true})
                            .then(() =>{
                                console.log('3');
                                resolve({status: 200, msg: "Đã xóa cat!"});
                            })
                            .catch(err =>{
                                console.log('That bai');
                                reject({status: 500, err: "Thất bại !"});
                            });
                        console.log('5');
                        resolve({status: 200, msg: "Đã xóa year!"});
                    })
                    .catch(err =>{
                        console.log('6');
                        reject({status: 500, err: "Thất bại !"});
                    });
                console.log('7');
                resolve({status: 200, msg: "Đã xóa !"});
            })
            .catch(err =>{
                console.log('8');
                reject({status: 500, err: "Thất bại !"});
            });
    });
//=========================================END ADD MOVIE========================================//

//=================================YEAR======================================//
exports.get_addYear =  function(req, res, next){
    res.render('admin/index/listYear/addYear', {
        pageTitle: req.__('Thêm mới năm'),
        csrfToken: req.csrfToken(),
        layout:false,
        success: req.flash('success'),
        // errors: req.session.errors,
        err: req.flash('err')
    });
    // req.session.errors = null;
};

exports.post_addYear = (year_id, year_name) =>
new Promise((resolve, reject) => {
    year.findOne({"year_id": year_id})
        .then(req =>{
            if (req){
                reject({status: 400, err: 'Trùng ID! Vui lòng nhập lại ID khác.'});
            } else {
                var newYear = new year({
                    year_id: year_id,
                    year_name: year_name
                });
                newYear.save()
                    .then(result =>{
                        resolve({status: 200, msg: 'Tạo mới thành công!'});
                    })
                    .catch(err =>{
                        reject({status: 500, err: 'Tạo mới không thành công!'});
                    });
            }
        })
    .catch(err =>{
        reject({status: 500, err: "Lỗi Server !"});
    })
});

exports.get_listYear = function(req, res, next){
    year.find().sort({_id: -1})
        .then(function(doc){
            res.render('admin/index/listYear/listYear', {
                pageTitle: req.__('Năm phát hành'),
                csrfToken: req.csrfToken(),
                layout:false,
                item:doc,
                success: req.flash('success'),
                err: req.flash('err')
            });
        });
};

exports.get_editYear = (_id) =>
    new Promise((resolve, reject) =>{
        year.findOne({"year_id": _id})
            .then(year => {
                if(year.length === 0){
                    reject({status:  404, err: 'ID không tồn tại!'});
                }else{
                    resolve({status: 200, item:year});
                }
            })
            .catch(err =>{
               reject({status: 500,err: "Lỗi server"});
            });
    });

exports.post_edityear = (year_id, year_name, id) =>
    new Promise((resolve, reject) => {
        console.log('Year_name: '+ year_name);
        year.findOne({'year_id':year_id})
            .then(() =>{
                year.findByIdAndUpdate({'_id': ObjectId(id)},{$set: {year_name: year_name}})
                .then(() =>{
                    console.log('1.1');
                    resolve({status: 200, msg: "Cập nhật thành công !"});
                })
                .catch(err =>{
                    console.log('1.2');
                    reject({status: 500, err: "Thất bại !"});
                })
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.get_delectYear = (id) =>
    new Promise((resolve, reject) => {
        console.log('id: '+id);
        year.findByIdAndRemove({'_id': ObjectId(id)})
            .then(() => {
                console.log('1.1');
                resolve({status: 200, msg: "Đã xóa !"});
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500, err: "Thất bại !"});
            });
    });
//=================================YEAR==================================//
//=================================CATALOG==================================//

exports.get_addCat =  function(req, res, next){
    res.render('admin/index/listCatalog/addCat', {
        pageTitle: req.__('Thêm mới thể loại'),
        csrfToken: req.csrfToken(),
        layout:false,
        success: req.flash('success'),
        err: req.flash('err')
    });
};

exports.post_addCat = (cat_id, cat_name_title) =>
    new Promise((resolve, reject) => {
        cat.findOne({"cat_id": cat_id})
            .then(req =>{
                if (req){
                    reject({status: 400, err: 'Trùng ID! Vui lòng nhập lại.'});
                } else {
                    var newCat = new cat({
                        cat_id: cat_id,
                        cat_name_title: cat_name_title,
                        cat_name_ascii: slug(cat_name_title)
                    });
                    newCat.save()
                        .then(result =>{
                            resolve({status: 200, msg: 'Tạo mới thành công!'});
                        })
                        .catch(err =>{
                            reject({status: 500, err: 'Tạo mới không thành công!'});
                        });
                }
            })
            .catch(err =>{
                reject({status: 500, err: "Lỗi Server !"});
            })
    });

exports.get_listCat = function(req, res, next){
    cat.find().sort({_id: -1})
        .then(function(doc){
            res.render('admin/index/listCatalog/listCat', {
                pageTitle: req.__('Thể loại'),
                csrfToken: req.csrfToken(),
                layout:false,
                item:doc,
                success: req.flash('success'),
                err: req.flash('err')
            });
        });
};

exports.get_editCat = (_id) =>
    new Promise((resolve, reject) =>{
        cat.findOne({"cat_id": _id})
            .then(cat => {
                if(cat.length === 0){
                    reject({status:  404, err: 'ID không tồn tại!'});
                }else{
                    resolve({status: 200, item:cat});
                }
            })
            .catch(err =>{
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.post_editCat = (cat_id, cat_name_title,id) =>
    new Promise((resolve, reject) => {

        cat.findOne({'cat_id': cat_id})
            .then(() =>{
                cat.findByIdAndUpdate({'_id': ObjectId(id)},{$set:
                        {cat_name_title: cat_name_title,cat_name_ascii:slug(cat_name_title)}})
                    .then(() =>{
                        console.log('1.1');
                        resolve({status: 200, msg: "Cập nhật thành công !"});
                    })
                    .catch(err =>{
                        console.log('1.2');
                        reject({status: 500, err: "Thất bại !"});
                    })
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.get_delectCat = (id) =>
    new Promise((resolve, reject) => {
        console.log('id: '+id);
        cat.findByIdAndRemove({'_id': ObjectId(id)})
            .then(() => {
                console.log('1.1');
                resolve({status: 200, msg: "Đã xóa !"});
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500, err: "Thất bại !"});
            });
    });
//=============================END CATALOG==================================//
//================================CHAPTER======================================//
exports.get_addChapter = (chapter_id,_id) =>
    new Promise((resolve,reject) =>{
        episode.findOne({'_id': ObjectId(_id)})
            .populate({path: "episode_order"})
            //noi bang chapter
            .then(chapter => {
                if(chapter.length === 0){
                    reject({status:  404, err: 'ID không tồn tại!'});
                }else{
                    resolve({status: 200, item:chapter});
                }
            })
            .catch(err =>{
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.post_addChapter = (chapter_id, idMovie, chapter_url,chapter_num) =>
    new Promise((resolve, reject) => {
        console.log(chapter_id+"/"+idMovie+"/"+chapter_url+"/"+chapter_num);
        chapter.findOne({"chapter_id": chapter_id})
            .then(req =>{
                console.log('vao');
                    var newChap = new chapter({
                        chapter_id: chapter_id,
                        chapter_url: chapter_url,
                        chapter_num: chapter_num
                    });
                    console.log(newChap);
                    newChap.save()
                        .then(result =>{
                            chapter.findByIdAndUpdate({"_id": ObjectId(newChap._id)},{$push: {"listEpisode": idMovie}},
                                {safe: true, upsert: true, new: true,multi:true},
                                function (err) {
                                    console.log("ADD list");
                                    resolve({status: 201, msg: "Tạo mới thành công!"});
                                });
                            episode.findByIdAndUpdate({"_id": ObjectId(idMovie)}, {$push: {"episode_order":newChap._id}},
                                {safe: true, upsert: true, new: true},
                                function (err) {
                                    console.log("ADD Episode");
                                    resolve({status: 201, msg: "Tạo mới thành công!"});
                                });
                        })
                        .catch(err =>{
                            reject({status: 500, err: 'Tạo mới không thành công!'});
                        });
            })
            .catch(err =>{
                reject({status: 500, err: "Lỗi Server !"});
            })
    });

exports.get_deleteChapter = (id,idMovie) =>
    new Promise((resolve, reject) => {
        console.log('idMovie: '+idMovie);
        chapter.findByIdAndRemove({'_id': ObjectId(id)})
            .then(() => {
                episode.findByIdAndUpdate(idMovie,
                    {$pull: {"episode_order": id}},
                    {safe: true, upsert: true, new:true},
                    function (err) {
                        console.log("DELE list");
                        resolve({status: 201, msg: "Đã xóa !"});
                       });
                console.log('1.1');
                resolve({status: 200, msg: "Đã xóa !"});
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500, err: "Thất bại !"});
            });
    });

exports.get_editChap = (chapter_id) =>
    new Promise((resolve, reject) =>{
        chapter.findOne({"chapter_id": chapter_id})
            .populate({path: "listEpisode"})
            .then(chap => {
                if(chap.length === 0){
                    reject({status:  404, err: 'ID không tồn tại!'});
                }else{
                    resolve({status: 200, item:chap});
                }
            })
            .catch(err =>{
                reject({status: 500,err: "Lỗi server"});
            });
    });

exports.post_editChapter = (chapter_url, chapter_num,id) =>
    new Promise((resolve, reject) => {

        chapter.findOne({'_id': ObjectId(id)})
            .then(() =>{
                chapter.findByIdAndUpdate({'_id': ObjectId(id)},{$set: {chapter_url: chapter_url,chapter_num:chapter_num}})
                    .then(() =>{
                        console.log('1.1');
                        resolve({status: 200, msg: "Cập nhật thành công !"});
                    })
                    .catch(err =>{
                        console.log('1.2');
                        reject({status: 500, err: "Thất bại !"});
                    })
            })
            .catch(err =>{
                console.log('2.1');
                reject({status: 500,err: "Lỗi server"});
            });
    });
//=============================END CHAPTER====================================//



exports.get_Logout = function(req, res, next){
    req.logOut();
    res.redirect('/admin/login');
};

exports.login_get = function (req, res, next) {
    var messages = req.flash('error');
    console.log(req.user);
    res.render('admin/login',{
        pageTitle: req.__('Đăng nhập quản trị viên'),
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        layout: false
    });
};

exports.login_post = passport.authenticate('admin.login', {
    successRedirect: '/admin/',
    failureRedirect: '/admin/login',
    badRequestMessage: 'Các trường điều bắt buộc',
    failureFlash: true
});

exports.notLogin_use = function (req, res, next) {
    next();
};


exports.isLoggedIn = function (req, res, next) {
    // console.log("THONG TIN: "+req.user);
    if(req.user && req.user.roles === 'ADMIN' && req.user.provider === 'admin'){
        return next();
    }else {
       return res.redirect('/admin/login');
    }
};

exports.notLoggedIn = function (req, res, next) {
    if(!req.user){
        return next();
    }else {
        // console.log("LOGIN PAGE: CO COOKIE, KO P ADMIN");
        if(req.user.roles !== 'ADMIN' && req.user.provider !== 'admin'){
            return next();
        }else {
            return res.redirect('/admin');
        }
    }
};



// Chi dung cho get_login form admin
exports.checkLoginAdmin = function (req, res, next) {
    if(!req.user){ //Neu khong ton tai cookie thi hien thi form login admin
        return next();
    } else {
        if(req.user.roles === 'ADMIN' && req.user.provider === 'admin'){ //kiem tra xem cookie co quyen admin va login form admin
            return res.redirect('/admin'); //Khong phai admin tiep tuc show form
        }else {
            return next(); // Ton tai cookie admin thi tro ve trang chu admin
        }
    }
};