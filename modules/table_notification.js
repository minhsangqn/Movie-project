const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const tableNotificationSchema = new Schema({
    id_user_notifi: [{ type: Schema.ObjectId, ref: 'member' }],
    status_notification: String,
    message_notification: String,
    check_view: Boolean,
    time_notification: String
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model("table_follow", tableNotificationSchema);