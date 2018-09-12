const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const tableCatSchema = new Schema({
    cat_id: String,
    cat_name_title: String,
    cat_name_ascii: String,
    listEpisode:[{ type: Schema.ObjectId, ref: 'table_episode' }]
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model("table_cat", tableCatSchema)