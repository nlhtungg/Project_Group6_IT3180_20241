const jwt = require('jsonwebtoken');
const accessTokenSecret = 'yourAccessTokenSecret';


const authenticateToken = (req, res, next) => {
  const token = req.cookies['accessToken'];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };