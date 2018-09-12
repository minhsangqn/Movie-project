const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tableYearSchema = new Schema({
    year_id: String,
    year_name: String
});
module.exports = mongoose.model("table_year", tableYearSchema);