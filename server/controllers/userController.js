const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with username ${email} not found` });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: `Invalid password` });
    }
    const payload = { id: user._id, role: user.role };
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payload, secretKey, { expiresIn });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Ereror", error: error.message });
  }
};
