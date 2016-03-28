var jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  var decoded;
  try {
    // header from Authorization: token myToken
    var token = req.headers.authorization.split(' ')[1];
    decoded = jwt.verify(token, process.env.SECRET || 'CHANGE ME');
    req.decodedToken = decoded;
    next();
  }
  catch (err) {
    return res.status(418).json({msg: 'authentication error'}); // I am a teapot
  }
}
