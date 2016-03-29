'use strict';
module.exports = (mongoose, models) => {
  let tableSchema = mongoose.Schema({
    table: String
  });
  let Table = mongoose.model('Table', tableSchema);
  models.Table = Table;
};
