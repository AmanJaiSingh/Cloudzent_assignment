const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ team_id: req.user.team_id }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password -__v")
      .populate("team_id", "name");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
