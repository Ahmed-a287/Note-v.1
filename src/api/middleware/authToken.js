const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  console.log("Authenticating token...");
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token == null) {
    console.log("No token provided.");
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403); // Forbidden
    }
    req.user = { _id: decodedToken._id };
    next();
  });
}
module.exports = authenticateToken;
