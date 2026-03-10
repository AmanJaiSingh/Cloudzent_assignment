const User = require("../models/User");
const Team = require("../models/Team");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, teamName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let team;
    if (teamName) {
      team = await Team.findOne({ name: teamName });
      if (!team) {
        team = await Team.create({ name: teamName });
      }
    } else {
      return res.status(400).json({ message: "teamName is required" });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      team_id: team._id
    });

    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    res.status(500).json({ message: "An unexpected error occurred during signup. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" }); // Keeping this vague for security

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, team_id: user.team_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "An unexpected error occurred during login. Please try again." });
  }
};
