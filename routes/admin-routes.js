'use strict';
let fs = require('fs');
let json2csv = require('json2csv');
let sendgrid  = require('sendgrid')(process.env.U, process.env.P);

module.exports = (router, models) => {
  let Session = models.Session;
  let Table = models.Table;
  let Subject = models.Subject;
  let User = models.User;

  router.route('/')
    .get((req, res) => {
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
          defaults.tables = list;
          res.render('admin');
        });// Table.find
      });// Subject.find
    })
    .put((req, res) => {
      // Clears the queue
      Session.find({timeOut:null}, (err, sessions) => {
        if (err) {
          res.json({error: err});
        }// if
        res.json(sessions);
      });// find
    });

  router.route('/users')
    .get((req, res) => {
      User.find({}, (err, users) => {
        if(err) return res.send(err);
        res.json(users);
      });
    })
    .post((req, res) => {
      var newUser = new User(req.body);
      newUser.save((err, user) => {
        if (err) {
          res.json(err.toString());
        } else {
          res.json({message:'New user created'});
        }// if
      }); // save
    });

  router.route('/downloads')
    .get((req, res) => {
      var fields = ['timeIn', 'timeOut', 'subject', 'table'];
      Session.find({}, (err, data) => {
        if(err) return res.send(err);
        json2csv({ data: data, fields: fields }, (err, csv) => {
          if (err) console.log(err);
          fs.writeFile(__dirname+'/../downloads/sessions.csv', csv, function(err) {
            if (err) throw err;
            res.send('File exported');
          });
        });
      });
    });

  router.route('/email')
    .get((req, res) => {
      var fields = ['timeIn', 'timeOut', 'subject', 'table'];
      Session.find({}, (err, data) => {
        if(err) return res.send(err);
        json2csv({ data: data, fields: fields }, (err, csv) => {
          if (err) console.log(err);
          sendgrid.send({
            to:       'javascriptdeveloper321@gmail.com',
            from:     'no-replay@example.com',
            subject:  'Export CSV Raw Data',
            text:     csv
          }, function(err, json) {
            if (err) { return console.error(err); }
            console.log(json);
          });
        });
      });
      res.send('Email sent');
    });
}
