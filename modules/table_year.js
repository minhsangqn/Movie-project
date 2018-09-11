var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tableYearSchema = new Schema({
    year_id: String,
    year_name: String
});
module.exports = mongoose.model("table_year", tableYearSchema);