'use strict';
module.exports = (mongoose, models) => {
  let userSchema = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
  });
  let User = mongoose.models('User', userSchema);
  models.User = User;
}
