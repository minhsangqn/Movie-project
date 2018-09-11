var express = require('express');
var router = express.Router();
//Require Controller modules
home_controller = require('../controllers/homeController');


/*----------------------GET home page------------------------*/
router.get('/', home_controller.index);
router.get('/phim/:nav', home_controller.get_phim);

/*----------------------GET details movie------------------------*/
router.get('/phim/:episode_id/:name/', (req,res) => {
    var name = req.param('name');
    var episode_id = req.param('episode_id');

    home_controller.details(name,episode_id)
    .then(result => {
        // console.log("LOG: "+result.episode);
        var Titile = result.name;
        res.render('frontend/Movie/movieDetails', {
            episode:result.episode,
            pageTitle: req.__(Titile)})
    })
    .catch(err =>{
        res.redirect('/');
    });
});
//=========================VIEW MOVIE============================//
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
