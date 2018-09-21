const express = require('express');
const router = express.Router();
const Category = require("../modules/table_cat");
const Year = require("../modules/table_year");
const chapter = require("../modules/table_chapter");
const episoder = require("../modules/table_episode");
const follow_user = require("../modules/table_follow");
const Member = require('../modules/member');
const Notification = require("../modules/table_notification");
//===========================API============================================//
//product
router.get("/f5bb0c8de146c67b44babbf4e6584cc0", (req, res) => {
    Category.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

//year
router.get("/202cb962ac59075b964b07152d234b70", (req, res) =>{
    Year.find().sort({year_id: -1})
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});
//chapter
router.get('/c5e549a0721069a573eeaba1677ce509', (req,res) => {
    chapter.find().sort({year_id: -1}).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });

});
//list
router.get('/c5e549a0721069a573eeaba1677ce508', (req,res) => {
    episoder.find().sort({_id: -1}).exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });

});
//================================get chapter==================//
router.post('/endpoint', function (req,res) {
     // var obj = {"err":"Lỗi server"};
    const id = req.body.id;
    console.log("vao: "+req.body.id);
    chapter.findOne({"_id":Object(id)})
    .then(obj => {
        console.log("DATA: "+obj);
        res.status(200);
        res.json(obj);
    })
    .catch(err => {
            res.status(500).json({error: err});
        });
});
// save episode or not save
router.post('/6d3e2d986f8fc589babced246675da13', function (req,res) {

    const IdUser = req.body.IdUser;
    const IdMovie = req.body.IdMovie;
    const IDEvent_movie = req.body.IDEvent_movie;
    const notSave = req.body.notSave;
    const Name_move = req.body.Name_move;
    const Name_move_ascii = req.body.Name_move_ascii;

    console.log("SAVE: "+IdUser+"/"+IdMovie+"/"+notSave);
    if(notSave === '0'){
        var newFollow = new follow_user({
            id_follow_save: IDEvent_movie,
            name_follow_save: Name_move,
            ascii_follow_save: Name_move_ascii
        });
        newFollow.save()
        .then(() =>{
            var idnew = newFollow._id;
            follow_user.findByIdAndUpdate(idnew,{$push:{"user_follow":IdUser}},
                {safe:true,upsert: true,new: true},
                function (err) {
                   console.log("da update user");
                });
            episoder.findByIdAndUpdate(IdMovie,{$push: {"savemovie":IdUser}},
                {safe: true, upsert: true, new: true},
                function (err) {
                    console.log("if");
                    var b = '1';
                    res.json(b);
                });
        })
            .catch(err =>{
                res.status(500);
            });
    }else {
        follow_user.remove({"id_event_save":IDEvent_movie})
            .then(() =>{
                episoder.findByIdAndUpdate(IdMovie,{$pull:{"savemovie":IdUser}},
                    {safe: true, upsert: true, new: true},
                    function (err) {
                        console.log("else");
                        var a = '0';
                        res.json(a);
                    });
            })
            .catch(err =>{
                res.status(500);
            });
    }
});
//check save or not save
router.post('/90f751119bc098ffc8097de4ff8fd0ae', function (req, res) {
    const IdUser = req.body.IdUser;
    const IdMovie = req.body.IdMovie;
    console.log("ID:"+ IdUser+"/"+IdMovie);
    episoder.findOne({'_id':Object(IdMovie),'savemovie': IdUser})
        .then(isSave =>{
            // console.log("SAVE: "+isSave);
            if(isSave === null){
                var isNotSave = '0';
                res.json(isNotSave);
            }else{
                var isItSave = '1';
                res.json(isItSave);
            }
            })
        .catch(err =>{
            console.log('1.2');
            res.status(500);
        });
    });
//check notification
router.post('/0cfd653d5d3e1e9fdbb644523d77971d', function (req,res) {
    const IdUser = req.body.IdUser;
    // console.log("ID:"+ IdUser);
    episoder.find({'savemovie':Object(IdUser)}).sort({episode_order: -1})
        .then(notifi =>{
            var ArrNoti= [];
            for (var i = 0;i<notifi.length;i++){
                var noti = notifi[i].episode_order;
                var nameNoti = notifi[i].episode_name;
                var name = notifi[i].episode_name_ascii;
                var episode_id = notifi[i].episode_id;
                // console.log('NOTI: '+notifi[i].episode_order);
                // console.log('NAME NOTI: '+ notifi[i].episode_name);
                ArrNoti.push({"newChapter":noti,"newName":nameNoti,"name":name,"episode_id":episode_id});
            }
            res.json(ArrNoti);
        })
        .catch(err =>{
            console.log('1.2');
            res.status(500);
        });
});


module.exports = router;