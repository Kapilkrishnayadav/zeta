const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
  
    if (authHeader) {
      const token = authHeader.split(" ")[1]; // Assuming the token is in the format "Bearer <token>"
  
      jwt.verify(token, "shhhh", (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };


  // module.exports = verifyToken;