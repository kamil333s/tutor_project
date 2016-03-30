var jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  console.log('Headers: '+req.headers.authorization);
  var decoded;
  try {
    // header from Authorization: token myToken

    var token = req.headers.authorization;
    decoded = jwt.verify(token, process.env.SECRET || 'CHANGE ME');
    req.decodedToken = decoded;
    next();
  }
  catch (err) {
    return res.status(418).json({msg: 'authentication error'}); // I am a teapot
  }
}
