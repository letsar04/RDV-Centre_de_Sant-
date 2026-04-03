const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
};

module.exports = adminAuth;
