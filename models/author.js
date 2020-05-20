var moment = require("moment");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the execption by returning an empty string for that case
  var fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }

  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  if (this.date_of_birth && this.date_of_death) {
    return `b. ${moment(this.date_of_birth).format("YYYY/MM/DD")} -
    d. ${moment(this.date_of_death).format("YYYY/MM/DD")}`;
  } else if (this.date_of_birth) {
    return "b. " + moment(this.date_of_birth).format("YYYY/MM/DD");
  } else {
    return "";
  }
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
