const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const User = require("../models/userModel");

console.log(User);

//Helper:Generate jwt
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

console.log("USER MODEL:", User);


// @desc Register a new user
// @route POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    //check if user exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.error("Register error:", error);

    // Mongo duplicate key (e.g., unique email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    // More detail in dev, generic in production
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Entered password:", password);

  try {
    const user = await userModel.findOne({ email }).select("+password");

    console.log("EMAIL FROM FRONTEND:", email);
    console.log("USER FROM DB:", user);


    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),

        buisnessName: user.buisnessName || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
      console.log("Stored password:", user.password);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messages: "server error" });
  }
};
   

// @desc Update user profile
// @route PUT /api/auth/update
// @access Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user=await User.findById(req.user.id);

    if(user){
      user.name=req.body.name || user.name;
      user.buisnessName=req.body.buisnessName || user.buisnessName;
      user.adress=req.body.address || user.address;
      user.phone=req.body.phone ||user.phone;

      const updateUser=await user.save();

      res.json({
        _id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        buisnessName:updateUser.buisnessName || "",
        address:updateUser.address || "",
        phone:updateUser.phone || "",
      });
    }else{
      res.status(404).json({message:"USer not found"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ messages: "server error" });
  }
};


// @desc Get current logged-in user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      businessName: req.user.businessName || "",
      address: req.user.address || "",
      phone: req.user.phone || "",
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
