const adminAuth = (req, res, next) => {
  try {
    // Check if user has admin or moderator role
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      message: 'Server error in admin authentication'
    });
  }
};

export default adminAuth;