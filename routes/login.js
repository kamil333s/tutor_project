'use strict';

let models = require('../models');
let User = models.User;

module.exports = (router) => {
  router.post('/login', (req, res) => {

    console.log(req.headers.authorization);
    let authorizationArray = req.headers.authorization.split(' ');
    let method = authorizationArray[0];
    let base64ed = authorizationArray[1];
    let authArray = new Buffer(base64ed, 'base64').toString().split(':');
    let name = authArray[0];
    let password = authArray[1];
    // parse based on basic or whatever method
    User.find({name: name}, (err, user) => {
      if (user.length == 0) {
        return res.json({status: 'failure'});
      }
      console.log('user:', user);
      let valid = user[0].compareHash(password);
      console.log('Valid: ', valid);
      if (!valid) {
        return res.json({status: 'failure'});
      }
      // generate and return the token
      var myToken = user[0].generateToken();
      res.json({message: 'Welcome, ' + name, token: myToken});
    }) ;
  });
};

























