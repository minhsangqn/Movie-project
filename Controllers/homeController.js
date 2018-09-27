const episode = require("../modules/table_episode");
const ObjectId = require('mongodb').ObjectId;
const Category = require("../modules/table_cat");
const Year = require("../modules/table_year");
const Notification = require("../modules/table_notification");
//-----------------------load index product------------------
exports.index = function(req,res){
    episode.find().sort({_id: -1})
        .then(docs =>{
            if(req.user) {
                let idUser = req.user._id;
                Notification.find({"id_user_notifi": idUser})
            }
            res.render('frontend/home/index', {pageTitle: req.__('Trang chủ'), episode: docs});
        })
        .catch(err =>{
            console.log('err');
            reject({status: 500, message: req.__('Loi server')});
        });
};
//=========================get_phim=================
exports.get_phim = function(req, res, next){
    var phim = req.param('nav');
    // console.log(phim);
    res.render('frontend/home/phimNavYear', {pageTitle: req.__('Năm phát hành'), phim: phim});
};
//-------------------------details-------------------

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
            .populate({path: "episode_order listEpisode"})
            .then(vie =>{
                if(vie.length === 0){
                    // console.log('khong');
                    reject ({status: 404,
                        message: req.__('Không tìm thấy phim!')
                    });
                }else{
                    // console.log("DATA1: "+ vie.listEpisode);
                    var title_cat = vie.listEpisode;
                    var name  = vie.episode_name;
                    var arrCT = vie.episode_order;
                    // console.log("NUM: "+arrCT);
                    var idCT = [];
                    for (var i = 0;i<arrCT.length;i++){
                        idCT.push({"id":arrCT[i]._id,"num":arrCT[i].chapter_num})
                    }
                    // console.log("ARR: "+idCT[0].num);
                    resolve({status: 200, title_cat: title_cat, name: name,viewEpi:idCT });
                }
            })
            .catch(err => {
                // console.log('2.1');
                reject({status: 500, message: req.__('Loi server')});
            });
    });
//========================================END VIEW==========================================//
