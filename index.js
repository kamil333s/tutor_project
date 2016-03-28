'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let mongoose = require('mongoose');
let models = require('./models');
let User = models.User
let Session = models.Session;
let Subject = models.Subject;
let Table = models.Tables;
let auth = require('./lib/authenticate')


// let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/db';
// mongoose.connect(DB_PORT);

app.use(bodyParser.json());

let publicRouter = express.Router();
require('./routes/login')(publicRouter);
app.use(publicRouter);


app.post('/sessions', (req, res) => {
  // Add a session to the queue - POST with body {"table" : "17", "Subject" : "Algebra 1"}
  var newSession = new Session(req.body);
  newSession.save((err, user) => {
    if (err) {
      console.log('err: ', err)
      console.log(typeof(err))
      res.json(err.toString())
    } else {
    res.json(user);
    }
  });
})

app.get('/sessions', (req, res) => {
  // Displays current queue  
  Session.find({}, (err, list) => {
    if (err) {
      res.json({error: err})
    }
    res.json(list);
  });
})


app.delete('/sessions/:id', (req, res) => {
  // Delete a session from the queue  
  Session.findById(req.params.id, (err, user) => {
    if (err) return res.send(err);
    Session.remove((err, user) => {
      res.json({'message': 'user removed'});
    });
  });
})

app.get('/admin', (req, res) => {
  // displays all Subjects and Tables
  var defaults = {'subjects':[], 'tables':[]}
  Subject.find({}, (err, list) => {
    if (err) {
      res.json({error: err})
    }// if
    defaults.subject = list;

    Table.find({}, (err, list) => {
      if (err) {
        res.json({error: err})
      }// if 
      defaults.table = list
      res.json(defaults);
    });    
  });
})

app.post('/admin/tables', (req, res) => {
  // Create tables
  Table.count({}, (err, tables) => {
    console.log("Count: ", tables)
    if (err) {
      return res.send(err);
    } else {
      if (tables == 0) {
        var newTable = new Table({'tables': req.body.tables})
        newTable.save((err, table) => {
          if (err) {
            console.log('err: ', err)
            console.log(typeof(err))
            res.json(err.toString())
          } else {
            res.json({'Tables created: ': table});
          }// if (err)
        })// save
      } else {
        res.send('Tables already exists!')
      }// if (tables ==0)
    }// if (err)
  })// count
})// post


//     console.log('Updated: ', user  );
//     res.json(user);
//   });

// })
app.put('/admin', (req, res) => {

})
app.delete('/admin', (req, res) => {
  // Clears the queue
})


app.post('/setup', auth, (req, res) => {
  // Add a user to the database 
  // POST with body {"name" : "kevin", "password" : "hashedPW", "admin" : "True"}
  var newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('err: ', err)
      console.log(typeof(err))
      res.json(err.toString())
    } else {
    res.json({'User created: ': user});
    }
  });

})

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