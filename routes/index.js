var express = require('express');
var router = express.Router();
//Require Controller modules
home_controller = require('../controllers/homeController');


/*----------------------GET home page------------------------*/
router.get('/', home_controller.index);
router.get('/phim/:nav', home_controller.get_phim);

/*----------------------GET details movie------------------------*/
//======================================One=========================//
// router.get('/phim/:episode_id/:name/:_id', (req,res) => {
//     var name = req.param('name');
//     var episode_id = req.param('episode_id');
//     var _id = req.param('_id');
//
//     home_controller.details(name,episode_id,_id)
//         .then(result => {
//             var Titile = result.episode.episode_name;
//             res.render('frontend/Movie/movieDetails', {
//                 episode:result.episode,
//                 pageTitle: req.__(Titile)})
//         })
//         .catch(err =>{
//             res.redirect('/');
//         });
// });
// router.get('/xem-phim/:episode_id/:episode_name_ascii', (req,res) =>{
//     var episode_id = req.param("episode_id");
//     console.log("id"+ episode_id);
//     home_controller.get_viewMovie(episode_id)
//         .then(result => {
//             console.log("LOG: "+result);
//             var title = result.name;
//             // console.log(title);
//             res.render('frontend/Movie/viewMovie',{
//                 viewEpi: result.viewEpi,
//                 pageTitle: req.__(title)}
//             )
//         })
//         .catch(err =>{
//             console.log('2');
//             res.redirect('/');
//         });
// });
//=========================VIEW MOVIE two============================//
router.get('/phim/:episode_id/:name/', (req,res) => {
    var name = req.param('name');
    var episode_id = req.param('episode_id');

    home_controller.details(name,episode_id)
        .then(result => {
            console.log("ID Chapter: "+result.episode.episode_order);
            var Titile = result.name;
            res.render('frontend/Movie/movieDetails', {
                episode:result.episode,
                pageTitle: req.__(Titile)})
        })
        .catch(err =>{
            res.redirect('/');
        });
});

router.get('/xem-phim/:episode_id/:episode_name_ascii', (req,res) =>{
    var episode_id = req.param("episode_id");
    // console.log("id"+ episode_id);
    home_controller.get_viewMovie(episode_id)
        .then(result => {
            console.log("DATA: "+ result.viewEpi);
            var name = result.name;
            res.render('frontend/Movie/viewMovie',{
                viewEpi: result.viewEpi,
                name:result.name,
                pageTitle: req.__(name)}
            )
        })
        .catch(err =>{
            console.log('2');
            res.redirect('/');
        });
});

//=========================END VIEW MOVIE============================//







module.exports = router;
