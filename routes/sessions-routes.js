'use strict';

module.exports = (router, models) => {
  let Session = models.Session;

  router.route('/sessions')
    .get((req, res) => {
      // Displays current queue
      Session.find({timeOut:null}, (err, sessions) => {

        if (err) {
          res.json({error: err});
        }// if
        res.json(sessions);
      });// find
    })
    .post((req, res) => {
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
    });

  router.route('/sessions/:id')
    .put((req, res) => {
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
    })
    .delete((req, res) => {
      // Delete a session from the queue
      Session.findById(req.params.id, (err, user) => {
        if (err) {
          res.send(err);
        }// if
        Session.remove((err, user) => {
          res.json({'message': 'session removed'});
        });// remove
      });// findById
    });
}
