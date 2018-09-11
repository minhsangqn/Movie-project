var mongoose = require("mongoose");
var  Schema = mongoose.Schema;
var tableCommentSchama = new Schema({
    comment_id: String,
    comment_film: String,
    comment_poster: String,
    comment_contnent: String,
    comment_time: String,
    create_at: Number
});
module.exports = mongoose.model("table_comment",tableCommentSchama);