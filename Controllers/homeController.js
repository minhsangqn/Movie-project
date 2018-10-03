const episode = require("../modules/table_episode");
const ObjectId = require('mongodb').ObjectId;
const chapter = require("../modules/table_chapter");
//-----------------------load index product------------------
exports.index = function(req,res){
    episode.find().sort({_id: -1})
        .then(docs =>{
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
                    // console.log("ID:  "+epi);
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
                    console.log('khong');
                    reject ({status: 404,
                        message: req.__('Không tìm thấy phim!')
                    });
                }else{
                    var arrCT = vie.episode_order;
                    console.log("CHAPTER: "+arrCT);
                    if (arrCT.length === 0){
                        console.log("khong");
                        resolve({status: 200, err: "Phim này đang cập nhật"});
                    } else{
                        var title_cat = vie.listEpisode;
                        var name  = vie.episode_name;
                        var id_episode = vie.episode_id;
                        var IDchapter = vie.episode_order[0]._id;
                        var name_ascii = vie.episode_name_ascii;
                        var idCT = [];
                        for (var i = 0;i<arrCT.length;i++){
                            idCT.push({"id":arrCT[i]._id,"num":arrCT[i].chapter_num,"id_episode":id_episode,"name_ascii":name_ascii})
                        }
                        resolve({status: 200, title_cat: title_cat, name: name,viewEpi:idCT,IDchapter:IDchapter});
                    }
                }
            })
            .catch(err => {
                reject({status: 500,err: "Lỗi server"});
            });
    });
//========================================END VIEW==========================================//
//=========================================view chapter movie===========================//
exports.get_chapter = (id_episode, num) =>
    new Promise((resolve, reject) =>{
        chapter.findOne({"chapter_id":id_episode,"chapter_num":num})
            .populate({path: "listEpisode"})
            .then(chapter =>{
                var idChapterM = chapter._id;
                // console.log("ID2: "+idChapterM);
                episode.findOne({"episode_id":id_episode})
                    .populate({path: "listEpisode episode_order"})
                    .then(episo =>{
                        var cat_title = episo.listEpisode;
                        var name_movie = episo.episode_name;
                        var title = chapter.listEpisode[0].episode_name_ascii;
                        var num = chapter.chapter_num;
                        var url = chapter.chapter_url;
                        var name = chapter.listEpisode[0].episode_name;
                        var arrChapter = ({"title":title,"num":num,"url":url,"name":name});
                        var arrCT = episo.episode_order;
                        // console.log(arrCT);
                        var idCT = [];
                        for (var i = 0;i<arrCT.length;i++){
                            idCT.push({"id":arrCT[i]._id,"num":arrCT[i].chapter_num,"id_episode":id_episode,"name_ascii":title})
                        }

                        // console.log("ARR: "+idCT);
                        resolve({status: 200, viewEpi:idCT,arrChapter: arrChapter,title_cat:cat_title,name:name_movie,idChapterM:idChapterM});
                    })
                    .catch(err =>{

                    });

            })
            .catch(err =>{
                // console.log('2.1'+err);
                reject({status: 500, message: req.__('Loi server')});
            });
    });
//=====================================End view chapter movie===========================//