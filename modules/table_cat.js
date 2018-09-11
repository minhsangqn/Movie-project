var mongoose = require("mongoose");
var  Schema = mongoose.Schema;
var tableCatSchema = new Schema({
    cat_id: String,
    cat_name_title: String,
    cat_name_ascii: String,
    listEpisode:[{ type: Schema.ObjectId, ref: 'table_episode' }]
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model("table_cat", tableCatSchema)