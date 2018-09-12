const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const catEpiso = new Schema({
    cat_id: String,
    episode_id: String,
    year_id: String
});
module.exports = mongoose.model("table_catepi", catEpiso);