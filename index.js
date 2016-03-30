'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let models = require('./models');
let publicRouter = express.Router();
let adminRouter = express.Router();
let sessionsRouter = express.Router();
let subjectsRouter = express.Router();
let tablesRouter = express.Router();
let auth = require('./lib/authenticate');

require('./routes/login')(publicRouter, models);
require('./routes/admin-routes')(adminRouter, models);
require('./routes/sessions-routes')(sessionsRouter, models);
require('./routes/subjects-routes')(subjectsRouter, models);
require('./routes/tables-routes')(tablesRouter, models);


app.set('view engine', 'ejs');
app.use(express.static('public'));
// The extended config object key now needs
// to be explicitly passed, since it now has no default value.
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(publicRouter);
app.use(sessionsRouter);
app.use('/admin', adminRouter, subjectsRouter, tablesRouter);



app.listen(3000, () => {
  console.log('Server started on 3000');
});
