var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var catEpiso = new Schema({
    cat_id: String,
    episode_id: String,
    year_id: String
});
module.exports = mongoose.model("table_catepi", catEpiso);