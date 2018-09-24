const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const FollowSchema = new Schema({
    id_follow: String,
    name_follow: String,
    user_follow: [{ type: Schema.ObjectId, ref: 'member' }],
    ascii_follow: String
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model("table_follows", FollowSchema);