$(document).ready(function () {
    //Get List year movie
    $.ajax({
        url: 'http://localhost:5000/API/202cb962ac59075b964b07152d234b70',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var outt = '';
            var j;
            for (j = 0;j < data.length; j++){
                outt += '<li><a href="/phim/'+ data[j].year_id +'">' +
                    data[j].year_name + '</a></li>';
            }
            document.getElementById("yearType").innerHTML = outt;
        }
    });
    //get List year movie
    //Get List category movie
    $.ajax({
        url: 'http://localhost:5000/API/f5bb0c8de146c67b44babbf4e6584cc0',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var out = '';
            var i;
            for (i = 0; i < data.length; i++) {
                out += '<li><a href="/phim/' + data[i].cat_name_ascii + '">' +
                    data[i].cat_name_title + '</a></li>';
            }
            document.getElementById("categoryType").innerHTML = out;
        }
    });
    //Get List category movie
    //Get notication user
    if(document.getElementById("IdUser") != null){
        var memberId = document.getElementById("IdUser").value;
        // console.log("IDMEMBER: "+memberId);
        var data = {memberId};
        $.ajax({
            type:'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:5000/API/0cfd653d5d3e1e9fdbb644523d77971d',
            success:function (data) {
                var SizeNoti = data.length;
                if (SizeNoti === 0){
                    $("#notiMess").click(function () {
                        var memberId = document.getElementById("IdUser").value;
                        // console.log("IDMEMBER: "+memberId);
                        var dataID = {memberId};
                        $.ajax({
                            type:'POST',
                            data: JSON.stringify(dataID),
                            contentType: 'application/json',
                            url: 'http://localhost:5000/API/faa0374d862abd5a68f19447cd641db1',
                            success:function (dataID) {
                                if(dataID == ''){
                                    $("#NotifiUser").html('<div><svg xmlns="http://www.w3.org/2000/svg" class="confetti" viewBox="0 0 1081 601"><path class="st0" d="M711.8 91.5c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7C695.2 84 702.7 91.5 711.8 91.5zM711.8 64.1c5.9 0 10.7 4.8 10.7 10.7s-4.8 10.7-10.7 10.7 -10.7-4.8-10.7-10.7S705.9 64.1 711.8 64.1z"></path><path class="st0" d="M74.5 108.3c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7C57.9 100.9 65.3 108.3 74.5 108.3zM74.5 81c5.9 0 10.7 4.8 10.7 10.7 0 5.9-4.8 10.7-10.7 10.7s-10.7-4.8-10.7-10.7S68.6 81 74.5 81z"></path><path class="st1" d="M303 146.1c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7C286.4 138.6 293.8 146.1 303 146.1zM303 118.7c5.9 0 10.7 4.8 10.7 10.7 0 5.9-4.8 10.7-10.7 10.7s-10.7-4.8-10.7-10.7C292.3 123.5 297.1 118.7 303 118.7z"></path><path class="st2" d="M243.4 347.4c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7S234.2 347.4 243.4 347.4zM243.4 320c5.9 0 10.7 4.8 10.7 10.7 0 5.9-4.8 10.7-10.7 10.7s-10.7-4.8-10.7-10.7S237.5 320 243.4 320z"></path><path class="st1" d="M809.8 542.3c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7C793.2 534.8 800.7 542.3 809.8 542.3zM809.8 514.9c5.9 0 10.7 4.8 10.7 10.7s-4.8 10.7-10.7 10.7 -10.7-4.8-10.7-10.7S803.9 514.9 809.8 514.9z"></path><path class="st3" d="M1060.5 548.3c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7 -16.7 7.5-16.7 16.7C1043.9 540.8 1051.4 548.3 1060.5 548.3zM1060.5 520.9c5.9 0 10.7 4.8 10.7 10.7s-4.8 10.7-10.7 10.7 -10.7-4.8-10.7-10.7S1054.6 520.9 1060.5 520.9z"></path><path class="st3" d="M387.9 25.2l7.4-7.4c1.1-1.1 1.1-3 0-4.1s-3-1.1-4.1 0l-7.4 7.4 -7.4-7.4c-1.1-1.1-3-1.1-4.1 0s-1.1 3 0 4.1l7.4 7.4 -7.4 7.4c-1.1 1.1-1.1 3 0 4.1s3 1.1 4.1 0l7.4-7.4 7.4 7.4c1.1 1.1 3 1.1 4.1 0s1.1-3 0-4.1L387.9 25.2z"></path><path class="st3" d="M368.3 498.6l7.4-7.4c1.1-1.1 1.1-3 0-4.1s-3-1.1-4.1 0l-7.4 7.4 -7.4-7.4c-1.1-1.1-3-1.1-4.1 0s-1.1 3 0 4.1l7.4 7.4 -7.4 7.4c-1.1 1.1-1.1 3 0 4.1s3 1.1 4.1 0l7.4-7.4 7.4 7.4c1.1 1.1 3 1.1 4.1 0s1.1-3 0-4.1L368.3 498.6z"></path><path class="st3" d="M16.4 270.2l7.4-7.4c1.1-1.1 1.1-3 0-4.1s-3-1.1-4.1 0l-7.4 7.4 -7.4-7.4c-1.1-1.1-3-1.1-4.1 0s-1.1 3 0 4.1l7.4 7.4 -7.4 7.4c-1.1 1.1-1.1 3 0 4.1s3 1.1 4.1 0l7.4-7.4 7.4 7.4c1.1 1.1 3 1.1 4.1 0s1.1-3 0-4.1L16.4 270.2z"></path><path class="st2" d="M824.7 351.1l7.4-7.4c1.1-1.1 1.1-3 0-4.1s-3-1.1-4.1 0l-7.4 7.4 -7.4-7.4c-1.1-1.1-3-1.1-4.1 0s-1.1 3 0 4.1l7.4 7.4 -7.4 7.4c-1.1 1.1-1.1 3 0 4.1s3 1.1 4.1 0l7.4-7.4 7.4 7.4c1.1 1.1 3 1.1 4.1 0s1.1-3 0-4.1L824.7 351.1z"></path><path class="st1" d="M146.3 573.6H138v-8.3c0-1.3-1-2.3-2.3-2.3s-2.3 1-2.3 2.3v8.3h-8.3c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3h8.3v8.3c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3v-8.3h8.3c1.3 0 2.3-1 2.3-2.3S147.6 573.6 146.3 573.6z"></path><path class="st1" d="M1005.6 76.3h-8.3V68c0-1.3-1-2.3-2.3-2.3s-2.3 1-2.3 2.3v8.3h-8.3c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3h8.3v8.3c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3v-8.3h8.3c1.3 0 2.3-1 2.3-2.3S1006.8 76.3 1005.6 76.3z"></path><path class="st1" d="M95.5 251.6c-3.5 0-6.3 2.8-6.3 6.3 0 3.5 2.8 6.3 6.3 6.3s6.3-2.8 6.3-6.3S99 251.6 95.5 251.6z"></path><path class="st0" d="M1032 281.8c-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3S1035.5 281.8 1032 281.8z"></path><path class="st2" d="M741.6 139.3c-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3 6.3-2.8 6.3-6.3S745 139.3 741.6 139.3z"></path><path class="st3" d="M890.7 43.5c3.3 0 6-2.7 6-6s-2.7-6-6-6 -6 2.7-6 6C884.8 40.8 887.4 43.5 890.7 43.5z"></path><path class="st0" d="M164.3 537.6c3.3 0 6-2.7 6-6s-2.7-6-6-6 -6 2.7-6 6C158.4 535 161 537.6 164.3 537.6z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell-off"><path d="M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg></div>')
                                }else{
                                    var outt = '';
                                    for (let iii = 0;iii<dataID.length;iii++){
                                        outt += '<a class="content isNoti" href="/phim/'+dataID[iii].status_notification[0].episode_id+'/'+dataID[iii].status_notification[0].episode_name_ascii+'"><div class="notification-item"><div class="notifi_detail row"><div class="img-notifi col-md-3 col-sm-3"><img src="/images/image_avatar/'+dataID[iii].status_notification[0].episode_image+'" alt="Avatar" class="avatar_notifi"></div><div class="col-md-9 col-sm-9"><h4 class="item-title"><b>'+dataID[iii].status_notification[0].episode_name+'</b> đã có tập <span>'+dataID[iii].message_notification+'</span></h4><h4 class="item_time">Vào lúc 4 giờ trước</h4></div></div></div></a>';
                                        $("#NotifiUser").html(outt);
                                    }
                                }
                            }
                        });
                    });
                }else{
                    $("#Notifi_mes").html('<p class="hasAMess">'+SizeNoti+'</p>');
                }
            }
        }) ;
    }
    //Click view notication user
    $("#notiMess").click(function () {
        var idUser = document.getElementById("IdUser").value;
        var data = {idUser};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:5000/API/1b3bab5327802e69c787a86976bc3d6d',
            success: function (data) {
                console.log(data);
                var outt = '';
                for (let ii = 0;ii<data.length;ii++){
                    outt += '<a class="content" href="/phim/'+data[ii].status_notification[0].episode_id+'/'+data[ii].status_notification[0].episode_name_ascii+'"><div class="notification-item"><div class="notifi_detail row"><div class="img-notifi col-md-3 col-sm-3"><img src="/images/image_avatar/'+data[ii].status_notification[0].episode_image+'" alt="Avatar" class="avatar_notifi"></div><div class="col-md-9 col-sm-9"><h4 class="item-title"><b>'+data[ii].status_notification[0].episode_name+'</b> đã có tập <span>'+data[ii].message_notification+'</span></h4><h4 class="item_time">Vào lúc 4 giờ trước</h4></div></div></div></a>';
                    $("#NotifiUser").html(outt);
                }
            }
        })
    });
    //click search
    $('.navbar-search input').focus(function () {
        $('#search-result').addClass('activated');
    }).blur(function () {
        $('#search-result').removeClass('activated');
    });
    //Hide sibar responsider
    var active_nav = $("#active-nav");
    $("#button-nav").click(function(){
        if ($('.activeNav')[0]){
            active_nav.removeClass("activeNav");
        }else{
            active_nav.addClass("activeNav");
        }
    });
    //CLick hider search resonsider
    $('.search-box input').focus(function () {
        console.log('a');
        $('#searchFirst').addClass('activated');
    }).blur(function () {
        $('#searchFirst').removeClass('activated');
    });
});