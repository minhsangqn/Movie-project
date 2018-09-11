var category = require("../modules/table_cat");
var member = require("../modules/member");

// -----------------lay danh muc ------------------
exports.getcategory = () =>
    new Promise((resolve, reject) =>{
       category.find({})
           .then(cat => {
               if(cat.length === 0){
                   reject({status: 400, message: "Không có danh mục nào !"});
               }else{
                   resolve({status: 200, allCategory: cat});
               }
           })
           .catch(err =>{
               reject({status: 500, message: "Lỗi server !"});
           });
    });
//---------------------tao danh muc-------------------
exports.creaCategory = (cat_id, cat_name_title, cat_name_ascii, listEpisode) =>
    new Promise((resolve, reject) => {
        category.findOne({"cat_id": cat_id})
            .then(cat => {
                if(cat){
                    reject({status: 400, message: "Danh mục đã bị trùng, xin đặt tên khác !"});
                }else {
                    var newcat = new category();
                    newcat.cat_id = cat_id;
                    newcat.cat_name_title = cat_name_title;
                    newcat.cat_name_ascii = cat_name_ascii;
                    listEpisode.cat_order = listEpisode;
                    newcat.save()
                        .then(result => {
                            resolve({status: 200, message: "Thêm thành cồng"});
                        })
                        .catch(err => {
                            reject({status: 500, message: "Thêm thất bại !"});
                        });
                }
            })
            .catch(err => {
                reject({status: 500, message: "Lỗi Server !"})
            })
    });