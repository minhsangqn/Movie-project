const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableEpiosodeSchema = new Schema({
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
    savemovie:[{type: Schema.ObjectId,ref: 'member'}],
    listEpisode: [{type: Schema.ObjectId, ref: 'table_cat'}],
    year_order: [{type: Schema.ObjectId, ref: 'table_year'}],
    nominations: String
});

module.exports = mongoose.model("table_episode", tableEpiosodeSchema);