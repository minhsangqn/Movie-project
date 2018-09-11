var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tableEpiosodeSchema = new Schema({
    episode_id: String,
    episode_name: String,
    episode_name_ascii: String,
    episode_film: String,
    episode_type: String,
    episode_order: [{type: Schema.ObjectId, ref: 'table_chapter'}],
    episode_image: String,
    episode_cmtid: [{ type: Schema.ObjectId, ref: 'table_comment' }],
    episode_view: String,
    episode_back: String,
    episode_info: String,
    episode_season: String,
    create_at: Number,
    episode_hide: String,
    listEpisode: [{type: Schema.ObjectId, ref: 'table_cat'}],
    year_order: [{type: Schema.ObjectId, ref: 'table_year'}]
});

module.exports = mongoose.model("table_episode", tableEpiosodeSchema);