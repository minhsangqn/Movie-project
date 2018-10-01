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
        follow_user.findOne({"id_follow": IDEvent_movie})
            .then(saveMovie =>{
                if (saveMovie){
                    console.log("vao if");
                    console.log("DATA: "+saveMovie);
                    follow_user.findByIdAndUpdate(saveMovie._id,{$push:{"user_follow":IdUser}},
                        {safe:true,upsert: true,new: true},
                        function (err) {
                            console.log("update if 1");
                        });
                } else {
                    console.log("vao else");
                    var followSave = new follow_user({
                        id_follow: IDEvent_movie,
                        name_follow: Name_move,
                        ascii_follow: Name_move_ascii
                    });
                    followSave.save()
                        .then(() =>{
                            var idnew = followSave._id;
                            follow_user.findByIdAndUpdate(idnew,{$push:{"user_follow":IdUser}},
                                {safe:true,upsert: true,new: true},
                                function (err) {
                                    console.log("update if 2");
                                });

                        })
                        .catch(err =>{
                            res.status(500);
                        });
                }
                episoder.findByIdAndUpdate(IdMovie,{$push: {"savemovie":IdUser}},
                    {safe: true, upsert: true, new: true},
                    function (err) {
                        console.log("else 2");
                        var b = '1';
                        res.json(b);
                    });
            })
        .catch(err =>{
            res.status(500);
        });

    }else {

        follow_user.update({"id_follow":IDEvent_movie},{$pull:{"user_follow":IdUser}},
            function (err) {
                console.log("pull user");
            })
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

//check notification userLogin
router.post('/0cfd653d5d3e1e9fdbb644523d77971d', function (req,res) {
   const iduser = req.body.memberId;
   // console.log(iduser);
    Notification.find({"id_user_notifi": iduser,"check_view": false})
        .then(noti =>{
            res.json(noti);
        })
        .catch(err =>{
            res.status(500);
        })
});
//check user view notication
router.post('/1b3bab5327802e69c787a86976bc3d6d', function (req,res) {
   const iduser = req.body.idUser;
    Notification.find({"id_user_notifi": iduser,"check_view": false})
        .then(data =>{
                var cou = 0;
                for (var i =0;i<data.length;i++){

                    // console.log("data.length: " +i +": "+data.length);

                    var idNo = data[i]._id;
                    Notification.findByIdAndUpdate({'_id': idNo},{$set: {check_view: 'true'}}, function (err) {
                        if (err){
                            console.log("loi");
                        } else{
                            console.log("da xem");
                        }
                    });
                    if(cou == data.length - 1){
                        console.log("vao");
                        Notification.find({"id_user_notifi": iduser,"check_view": true})
                            .populate({path: "status_notification"})
                            .then(have =>{
                                // console.log("HAVE: "+have);
                                res.json(have);
                            })
                            .catch(err =>{

                            });
                    }
                    cou++;
                }
        })
        .catch(err =>{
            res.status(500);
        })
});

//
router.post('/faa0374d862abd5a68f19447cd641db1', function (req,res) {
    const iduser = req.body.memberId;
    // console.log(iduser);
    Notification.find({"id_user_notifi": iduser,"check_view": true})
        .populate({path: "status_notification"})
        .then(noti =>{
            // console.log(noti);
            res.json(noti);
        })
        .catch(err =>{
            res.status(500);
        })
});

module.exports = router;

