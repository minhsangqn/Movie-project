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
exports.details = (name,episode_id,_id) =>
    new Promise((resolve, reject) =>{
        episode.findOne({"_id": ObjectId(_id)})
            .populate({path: "listEpisode year_order episode_order", select: "cat_name_title year_name chapter_num"})
            .then(epi =>{
                if(epi.length === 0){
                    reject ({status: 404,
                        message: req.__('Không tìm thấy phim!')
                    });
                }else{
                    resolve({status: 200, episode: epi});
                }
            })
            .catch(err => {
                reject({status: 500, message: req.__('Loi server')});
            });
    });
//===================================VIEW MOVIE===========================//
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
                    console.log("ARR: "+idCT);

                    resolve({status: 200, name: name,viewEpi:idCT });
                }
            })
            .catch(err => {
                // console.log('2.1');
                reject({status: 500, message: req.__('Loi server')});
            });
    });