const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Authentication middleware
 * Extracts JWT from Authorization header, verifies it,
 * and attaches the user object to req.user.
 * Rejects with 401 if token is missing or invalid.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — user not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid token',
    });
  }
};

/**
 * adminOnly - Authorization middleware (RBAC)
 * Must be used AFTER protect middleware.
 * Checks if the authenticated user has the 'admin' role.
 * Rejects with 403 if the user is not an admin.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — admin access required',
    });
  }
};

module.exports = { protect, adminOnly };
