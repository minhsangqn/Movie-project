const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const tableFollowSchema = new Schema({
    id_follow_save: String,
    name_follow_save: String,
    user_follow:[{ type: Schema.ObjectId, ref: 'member' }],
    ascii_follow_save: String
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model("table_follow", tableFollowSchema);