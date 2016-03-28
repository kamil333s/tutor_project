'use strict';
module.exports = (mongoose, models) => {
  let tutorSchema = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
  });
  let Tutor = mongoose.models('Tutor', tutorSchema);
  models.Tutor = Tutor;
}
