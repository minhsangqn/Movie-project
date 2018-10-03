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
    const ipInfo = getIP(req);

    home_controller.details(name,episode_id)
        .then(result => {
            // console.log("ID Chapter: "+result.episode.episode_order);
            const Titile = result.name;
            const ipclient = ipInfo.clientIp;
            console.log("IpClient: "+ipclient);
            res.render('frontend/Movie/movieDetails', {
                ipclient: ipclient,
                episode:result.episode,
                pageTitle: req.__(Titile)})
        })
        .catch(err =>{
            res.redirect('/');
        });
});

router.get('/xem-phim/:episode_id-:episode_name_ascii', (req,res) =>{
    const episode_id = req.param("episode_id");

    home_controller.get_viewMovie(episode_id)
        .then(result => {
            const idChapter = JSON.stringify(result.viewEpi[0]);
            console.log("Chapter: "+idChapter);
            const name = result.name;
            if (result.msg) {
                console.log("khong");

            }else {
                console.log("co");
                res.render('frontend/Movie/viewMovie',{
                    IDchapter:result.IDchapter,
                    viewEpi: result.viewEpi,
                    name:result.name,
                    title_cat: result.title_cat,
                    chapterone: idChapter,
                    pageTitle: req.__(name)}
                )
            }
        })
        .catch(err =>{
            req.flash('err', err.err);
            console.log('loi');
            res.redirect('/');
        });
});
//=========================END VIEW MOVIE============================//


//=========================view chapter movie===========================//
router.get('/xem-phim/:id_episode-:name_ascii/tap-:num',(req,res) =>{
    const id_episode = req.param("id_episode");
    const num = req.param("num");
    console.log("NUM: "+id_episode+"/"+num);

    home_controller.get_chapter(id_episode, num)
        .then(chapter =>{
            console.log("CHAPTER: "+chapter);
            // console.log("CHAPTER: "+chapter.arrChapter.title);
            res.render('frontend/Movie/viewMovie',{
                viewEpi:chapter.viewEpi,
                idChapterM:chapter.idChapterM,
                title_cat:chapter.title_cat,
                arrChapter: chapter.arrChapter,
                name: chapter.name,
                pageTitle: req.__(chapter.arrChapter.name)}
            )
        })
        .catch(err =>{
            console.log('2');
            res.redirect('/');
        });
});

//======================End view chapter movie===========================//





module.exports = router;
