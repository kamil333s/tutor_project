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


app.set('view engine', 'ejs');

// The extended config object key now needs
// to be explicitly passed, since it now has no default value.
app.use(bodyParser.urlencoded({
  extended: true
}));


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
      res.json({
        message: 'Updated session',
        data: session
      });
    }
  });
});

// Create new session in queue- POST with body {"table" : "17", "subject" : "Algebra 1"}
app.post('/sessions', (req, res) => {
  Session.count({table:req.body.table, subject:req.body.subject, timeOut:null}, (err, sessions) => {
    if (err) {
      res.json({error: err});
    }// if (err)
    if (sessions > 0) {
      res.json({message: 'You are already in the queue!'});
    } else {
      var d = new Date();
      var sessionObj = req.body;
      sessionObj.timeIn = d;
      sessionObj.timeOut = '';
      var newSession = new Session(sessionObj);
      newSession.save((err, session) => {
        if (err) {
          res.json(err.toString());
        } else {
          res.json(session);
        }// if (err)
      });// save
    }// if (sessions > 0)
  });// count
});// post

// Display all open sessions
app.get('/sessions', (req, res) => {
  // Displays current queue
  Session.find({timeOut:null}, (err, sessions) => {
    if (err) {
      res.json({error: err});
    }// if
    res.json(sessions);
  });// find
});// get

// Delete a session
app.delete('/sessions/:id', (req, res) => {
  // Delete a session from the queue
  Session.findById(req.params.id, (err, user) => {
    if (err) {
      res.send(err);
    }// if
    Session.remove((err, user) => {
      res.json({'message': 'session removed'});
    });// remove
  });// findById
});// delete

/*
========================
ADMIN====================
========================
*/

app.put('/admin', (req, res) => {
  // Clears the queue

  Session.find({timeOut:null}, (err, sessions) => {
    if (err) {
      res.json({error: err});
    }// if
    res.json(sessions);
  });// find

});

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
        res.json({error: err})
      }// if
      defaults.tables = list;
      res.render('admin');
    });// Table.find
  });// Subject.find
});// get


/*
=================
SUBJECTS============
=================
*/

// Display the subjects
app.get('/admin/subjects', (req, res) => {
  console.log(req.method);
  Subject.find({}, (err, list) => {
    if (err) {
      res.json({error: err});
    }// if
    res.json(list);
  }); // find
});// get

// Deletes all subjects
app.delete('/admin/subjects', (req, res) => {
  Subject.remove({}, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Subjects deleted!');
    }// if
  });// remove
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
        newSubject.subjects= req.body.subjects;
        newSubject.save((err, subject) => {
          if (err) {
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
  console.log(req.body);
  Subject.findById(req.params.id, (err, subject) => {
    if (err) {
      return res.send(err);
    } // if
    // console.log('Updated: ', subject);
    req.body.subjects.forEach(function(sub) {
      subject.subjects.push(sub);
    })
    subject.save(function(err) {
      if(err) return res.send(err);
      res.json({
        message: 'Subject updated',
        data: subject
      });
    });

  });// findByIdAndUpdate
});// put

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
  }); // find
}); // get

// Deletes all tables
app.delete('/admin/tables', (req, res) => {
  Table.remove({}, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Tables deleted!');
    } // if
  }); // remove
}); // delete

// Creates the list of tables
app.post('/admin/tables', (req, res) => {
  console.log(req.body.tables);
  // Create tables
  Table.count({}, (err, tables) => {
    if (err) {
      return res.send(err);
    } else {
      if (tables == 0) {
        var newTable = new Table(req.body);
        newTable.save((err, table) => {
          if (err) {
            res.json(err.toString());
          } else {
            res.json(table);
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
  Table.findById(req.params.id, (err, table) => {
    if (err) {
      return res.send(err);
    } // if
    req.body.tables.forEach(function(tab) {
      table.tables.push(tab);
    })
    table.save(function(err) {
      if(err) return res.send(err);
      res.json({
        message: 'Table updated',
        data: table
      });
    })

  }); //findByIdAndUpdate
}); //put



// Add a user to the database
app.post('/users', (req, res) => {
  // POST with body {"name" : "kevin", "password" : "hashedPW", "admin" : "True"}
  var newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      res.json(err.toString());
    } else {
      res.json({message:'New user created'});
    }// if
  }); // save
});// post

// Get all current users
app.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if(err) return res.send(err);
    res.json(users);
  })
});// get

app.listen(3000, () => {
  console.log('Server started on 3000');
});
