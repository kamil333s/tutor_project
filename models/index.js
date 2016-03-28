'use strict';
let mongoose = require('mongoose');
mongoose.connect(process.en.MONG_URI);
let models = {};

require('./session')(mongoose, models);
require('./subject')(mongoose, models);
require('./tutor')(mongoose, models);
require('./table')(mongoose, models);

module.exports = models;
