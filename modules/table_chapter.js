var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tableChapterSchema = new Schema({
    chapter_id: String,
    listEpisode: [{type: Schema.ObjectId, ref: 'table_episode'}],
    chapter_url: String,
    chapter_num: String
});
module.exports = mongoose.model("table_chapter", tableChapterSchema);