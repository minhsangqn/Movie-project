var episode = require("../modules/table_episode");
var ObjectId = require('mongodb').ObjectId;
var Category = require("../modules/table_cat");
var Year = require("../modules/table_year");

//-----------------------load index product------------------
exports.index = function (req, res, next) {
    episode.find(function(err,docs) {
       var episodeChunks = [];
       for (var i = 0; i < docs.length; i++){
           episodeChunks.push(docs.slice(i));
       }
        res.render('frontend/home/index', {pageTitle: req.__('Trang chủ'), episode: docs});
    });
};
//=========================get_phim=================
exports.get_phim = function(req, res, next){
    var phim = req.param('nav');
    // console.log(phim);
    res.render('frontend/home/phimNavYear', {pageTitle: req.__('Năm phát hành'), phim: phim});
};
//-------------------------details-------------------

//=============================WAY ONE===============================//
// exports.details = (name,episode_id,_id) =>
//     new Promise((resolve, reject) =>{
//         episode.findOne({"_id": ObjectId(_id)})
//             .populate({path: "listEpisode year_order episode_order", select: "cat_name_title year_name chapter_num"})
//             .then(epi =>{
//                 if(epi.length === 0){
//                     reject ({status: 404,
//                         message: req.__('Không tìm thấy phim!')
//                     });
//                 }else{
//                     console.log(epi);
//                     resolve({status: 200, episode: epi});
//                 }
//             })
//             .catch(err => {
//                 reject({status: 500, message: req.__('Loi server')});
//             });
//     });
// //
// exports.get_viewMovie = (episode_id) =>
//     new Promise((resolve, reject) => {
//         episode.find({episode_id: episode_id} ,{episode_order:1,episode_name:1 } ).limit(1)
//             .then(vie => {
//                 if (vie.length === 0) {
//                     console.log('khong');
//                     reject({
//                         status: 404,
//                         message: req.__('Không tìm thấy phim!')
//                     });
//                 } else {
//                    /* var name = vie.episode_name;
//                     var oj = { " id": vie.episode_order._id
//                                 ,"url": vie.episode_order.chapter_url
//                                 ,"name": name};
//                                */
//                     console.log('vieResult: '+vie);
//                     resolve({status: 200, viewEpi: vie});
//                 }
//             });
//     });
//==================================WAY TWO======================================//
//===================================VIEW DETAI===========================//
exports.details = (name,episode_id) =>
    new Promise((resolve, reject) =>{
        episode.findOne({episode_id: episode_id},{_id:1})
            // .populate({path: "listEpisode year_order episode_order", select: "cat_name_title year_name chapter_num"})
            .then(epi =>{
                if(epi.length === 0){
                    reject ({status: 404,
                        message: req.__('Không tìm thấy phim!')
                    });
                }else{
                    console.log("ID:  "+epi);
                    episode.findOne({"_id":ObjectId(epi._id)})
                    .populate({path: "listEpisode year_order episode_order", select: "cat_name_title year_name chapter_num"})
                        .then(data =>{
                            var name = data.episode_name;
                            resolve({status: 200,episode: data,name: name});
                        })
                        .catch(err =>{
                            console.log('err');
                            reject({status: 500, message: req.__('Loi server')});
                        });
                    // console.log('tra lan 2');
                    // resolve({status: 200, episode: data,name: name});
                }
            })
            .catch(err => {
                // console.log('err2');
                reject({status: 500, message: req.__('Loi server')});
            });
    });

//=============================VIEW MOVIE=========================================//
exports.get_viewMovie = (episode_id) =>
    new Promise((resolve, reject) =>{
        episode.findOne({episode_id: episode_id})
            .populate({path: "episode_order"})
            .then(vie =>{
                if(vie.length === 0){
                    // console.log('khong');
                    reject ({status: 404,
                        message: req.__('Không tìm thấy phim!')
                    });
                }else{
                    var name  = vie.episode_name;
                    var arrCT = vie.episode_order;
                    var idCT = [];
                    for (var i = 0;i<arrCT.length;i++){
                        idCT.push({"id":arrCT[i]._id,"num":arrCT[i].chapter_num})
                    }
                    console.log("ARR: "+idCT[0].num);
                    resolve({status: 200, name: name,viewEpi:idCT });
                }
            })
            .catch(err => {
                // console.log('2.1');
                reject({status: 500, message: req.__('Loi server')});
            });
    });
//========================================END VIEW==========================================//
