// middleware/role.js
module.exports = function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role === role) return next();
    return res.status(403).json({ message: `Only ${role}s allowed.` });
  };
};
