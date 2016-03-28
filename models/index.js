'use strict';
let mongoose = require('mongoose');
mongoose.connect(/*process.env.MONG_URI || */'mongodb://localhost/db');
let models = {};

require('./session')(mongoose, models);
require('./subject')(mongoose, models);
require('./user')(mongoose, models);
require('./table')(mongoose, models);

module.exports = models;
