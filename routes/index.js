const express = require('express');
const router = express.Router();
const getIP = require('ipware')().get_ip;
//Require Controller modules
home_controller = require('../controllers/homeController');


/*----------------------GET home page------------------------*/
router.get('/', home_controller.index);
router.get('/phim/:nav', home_controller.get_phim);

/*----------------------GET details movie------------------------*/
router.get('/phim/:episode_id/:name/', (req,res) => {
    const name = req.param('name');
    const episode_id = req.param('episode_id');

    home_controller.details(name,episode_id)
        .then(result => {
            console.log("ID Chapter: "+result.episode.episode_order);
            const Titile = result.name;
            res.render('frontend/Movie/movieDetails', {
                episode:result.episode,
                pageTitle: req.__(Titile)})
        })
        .catch(err =>{
            res.redirect('/');
        });
});

router.get('/xem-phim/:episode_id/:episode_name_ascii', (req,res) =>{
    const episode_id = req.param("episode_id");
    const ipInfo = getIP(req);
    console.log("IP: "+ipInfo.clientIp);

    home_controller.get_viewMovie(episode_id)
        .then(result => {

            // console.log("DATA: "+JSON.stringify(result.viewEpi[0]));
            const idChapter = JSON.stringify(result.viewEpi[0]);
            const name = result.name;

            res.render('frontend/Movie/viewMovie',{
                viewEpi: result.viewEpi,
                name:result.name,
                chapterone: idChapter,
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
