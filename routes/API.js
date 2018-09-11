var express = require('express');
var router = express.Router();
var Category = require("../modules/table_cat");
var Year = require("../modules/table_year");
var chapter = require("../modules/table_chapter");
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



module.exports = router;