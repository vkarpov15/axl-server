exports.current = function() {
  return function(req, res) {
    return res.json({ user: req.user });
  };
};