'use strict';
module.exports = (mongoose, models) => {
  let tutorSchema = mongoose.Schema({
    name: String,
    password: String
  });
  let Tutor = mongoose.models('Tutor', tutorSchema);
  models.Tutor = Tutor;
}
