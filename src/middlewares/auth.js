const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Not authorized to access this route" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, status: true }
      });

      if (!user) {
        return res.status(401).json({ success: false, error: "User associated with token no longer exists" });
      }

      if (user.status === "INACTIVE") {
        return res.status(403).json({ success: false, error: "User account is inactive" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, error: "Not authorized to access this route" });
    }
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: "You do not have permission to perform this action" 
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
