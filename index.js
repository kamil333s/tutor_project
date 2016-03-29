'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let mongoose = require('mongoose');
let models = require('./models');
let User = models.User;
let Session = models.Session;
let Subject = models.Subject;
let Table = models.Table;
let auth = require('./lib/authenticate');


// let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/db';
// mongoose.connect(DB_PORT);

app.use(bodyParser.json());

let publicRouter = express.Router();
require('./routes/login')(publicRouter);
app.use(publicRouter);

/*
=======================
SESSIONS=================
=======================
*/

// Complete tutor session and save timeOut - nothing to submit
app.put('/sessions/:id', (req, res) => {
  var d = new Date();
  Session.findByIdAndUpdate(req.params.id, {timeOut: d}, (err, session) => {
    if (err) {
      console.log('err: ', err);
      console.log(typeof(err));
      res.json(err.toString());
    } else {
      res.json(session);
    }
  });
});

// Create new session in queue- POST with body {"table" : "17", "subject" : "Algebra 1"}
app.post('/sessions', (req, res) => {
  var d = new Date();
  var sessionObj = req.body;
  sessionObj.timeIn = d;
  sessionObj.timeOut = '';
  var newSession = new Session(sessionObj);
  newSession.save((err, session) => {
    if (err) {
      console.log('err: ', err);
      console.log(typeof(err));
      res.json(err.toString());
    } else {
      res.json(session);
    }
  });
});

// Display all open sessions
app.get('/sessions', (req, res) => {
  // Displays current queue  
  Session.find({timeOut:null}, (err, sessions) => {
    if (err) {
      res.json({error: err});
    }
    res.json(sessions);
  });
});

// Delete a session
app.delete('/sessions/:id', (req, res) => {
  // Delete a session from the queue  
  Session.findById(req.params.id, (err, user) => {
    if (err) return res.send(err);
    Session.remove((err, user) => {
      res.json({'message': 'session removed'});
    });
  });
});




/*
========================
ADMIN====================
========================
*/

app.get('/admin', (req, res) => {
  // displays all Subjects and Tables
  var defaults = {'subjects':[], 'tables':[]};
  Subject.find({}, (err, list) => {
    if (err) {
      res.json({error: err});
    }// if
    defaults.subjects = list;

    Table.find({}, (err, list) => {
      if (err) {
        res.json({error: err});
      }// if 
      defaults.tables = list[0].table;
      res.json(defaults);
    });    
  });
});


/*
=================
SUBJECTS============
=================
*/

// Display the subjects
app.get('/admin/subjects', (req, res) => {
  Subject.find({}, (err, list) => {
    if (err) {
      res.json({error: err});
    }// if 
    res.json(list);
  });    
});

// Deletes all subjects
app.delete('/admin/subjects', (req, res) => {
  Subject.remove({}, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Subjects deleted!');
    }
  });
});// delete

// Creates the list of subjects
app.post('/admin/subjects', (req, res) => {
  // Create subjects
  console.log(req.body);
  Subject.count({}, (err, subjects) => {
    if (err) {
      return res.send(err);
    } else {
      if (subjects == 0) {
        var newSubject = new Subject();
        newSubject.subject = req.body.subjects;
        console.log('newSubject: ', newSubject);
        console.log('req.body: ', req.body);
        console.log('newSubject.subject: ', newSubject.subject);
        console.log('req.body.subjects: ', req.body.subjects);
        newSubject.save((err, subject) => {
          if (err) {
            console.log('err: ', err);
            console.log(typeof(err));
            res.json(err.toString());
          } else {
            res.json(subject);
          }// if (err)
        });// save
      } else {
        res.send('Subjects already exists!');
      }// if (tables ==0)
    }// if (err)
  });// count
});// post

// Modify the list of subjects
app.put('/admin/subjects/:id', (req, res) => {
  Subject.findByIdAndUpdate(req.params.id, { subject: req.body.subject }, (err, subject) => {
    if (err) {
      return res.send(err);
    }
    console.log('Updated: ', subject);
    res.json(subject);
  });
});

/*
=================
TABLES============
=================
*/

// Display the tables
app.get('/admin/tables', (req, res) => {
  Table.find({}, (err, list) => {
    if (err) {
      res.json({error: err});
    }// if 
    res.json(list);
  });    
});

// Deletes all tables
app.delete('/admin/tables', (req, res) => {
  Table.remove({}, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Tables deleted!');
    }
  });
});// delete

// Creates the list of tables
app.post('/admin/tables', (req, res) => {
  // Create tables
  console.log(req.body);
  Table.count({}, (err, tables) => {
    console.log('Count: ', tables);
    if (err) {
      return res.send(err);
    } else {
      if (tables == 0) {
        var newTable = new Table({'table': req.body.table});
        newTable.save((err, table) => {
          if (err) {
            console.log('err: ', err);
            console.log(typeof(err));
            res.json(err.toString());
          } else {
            res.json({'Tables created: ': table});
          }// if (err)
        });// save
      } else {
        res.send('Tables already exists!');
      }// if (tables ==0)
    }// if (err)
  });// count
});// post

// Modify the list of tables
app.put('/admin/tables/:id', (req, res) => {
  Table.findByIdAndUpdate(req.params.id, { table: req.body.table }, (err, table) => {
    if (err) {
      return res.send(err);
    }
    console.log('Updated: ', table);
    res.json(table);
  });
});

app.delete('/admin', (req, res) => {
  // Clears the queue
});


// Add a user to the database 
app.post('/setup', auth, (req, res) => {
  // POST with body {"name" : "kevin", "password" : "hashedPW", "admin" : "True"}
  var newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('err: ', err);
      console.log(typeof(err));
      res.json(err.toString());
    } else {
      res.json({'User created: ': user});
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on 3000');
});


/*
app.post('/users', (req, res) => {
  var newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('err: ', err)
      console.log(typeof(err))
      res.json(err.toString())
    } else {
    res.json(user);
    }
  });
});

app.get('/users', auth, (req, res) => {
  User.find({}, (err, list) => {
    if (err) {
      res.json({error: err})
    }
    res.json(list);
  });
});

app.put('/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { password: req.body.password }, (err, user) => {
    if (err) return res.send(err);
    console.log('Updated: ', user  );
    res.json(user);
  });
});

app.delete('/users/:id', auth, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.send(err);
    user.remove((err, user) => {
      res.json({'message': 'user removed'});
    });
  });
});



*/