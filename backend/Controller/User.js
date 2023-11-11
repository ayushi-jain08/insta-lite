const User = require("../Model/User");
const cloudinary = require("../Cloudinary");
const bycrpyt = require("bcrypt");
const GenerateToken = require("../GenerateToken");
const { mongo } = require("mongoose");
const { default: mongoose } = require("mongoose");

// ====================REGISTER USER====================
const RegisterUser = async (req, res) => {
  if (!req.files || !req.files.pimg || !req.files.cimg) {
    return res
      .status(400)
      .json({ message: "Both profile and cover images are required." });
  }
  const file = req.files.pimg;
  const cfile = req.files.cimg;
  const folder = "images";

  // Upload profile picture to Cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
  });

  // Upload cover picture to Cloudinary
  const cResult = await cloudinary.uploader.upload(cfile.tempFilePath, {
    folder,
  });

  try {
    const { name, email, work, worksAt, status, livesIn, study, password } =
      req.body;

    const user = new User({
      name,
      email,
      work,
      worksAt,
      status,
      livesIn,
      study,
      password,
      profilePic: (await result).url, // URL of the uploaded profile picture
      coverPic: (await cResult).url, // URL of the uploaded profile picture
    });
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "This email already exists.",
      });
    }

    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================LOGIN USER========================
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }
    const userLogin = await User.findOne({ email });
    console.log(userLogin);
    if (!userLogin) {
      return res.status(400).json({ error: "invalid email" });
    } else {
      const isMatch = await bycrpyt.compare(password, userLogin.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credential" });
      }
      const token = GenerateToken(userLogin._id);
      console.log("Generated token:", token);
      return res.status(200).json({
        _id: userLogin._id,
        name: userLogin.name,
        email: userLogin.email,
        work: userLogin.work,
        worksAt: userLogin.worksAt,
        status: userLogin.status,
        livesIn: userLogin.livesIn,
        study: userLogin.study,
        profilePic: userLogin.profilePic,
        coverPic: userLogin.coverPic,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================GET OTHER USER PROFILE==============================
const GetOtherUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!user) {
      res.status(400).json({
        success: true,
        message: "No User Found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================GET ALL USER=========================
const GetAllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perpage = 5;

  const startIndex = (page - 1) * perpage;
  try {
    const nameFilter = req.query.name ? { name: req.query.name } : {};
    const totalUser = await User.countDocuments();
    const totalPages = Math.ceil(totalUser / perpage);
    const user = await User.find(nameFilter)
      .find({
        _id: { $ne: req.user._id },
      })
      .skip(startIndex)
      .limit(perpage);

    res.status(200).json({
      success: true,
      user,
      totalUser,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const MyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!userId) {
      res.status(400).json({
        success: true,
        message: "No User Found",
      });
    }
    const { password, ...otherDeatils } = user._doc;
    res.status(200).json(otherDeatils);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//  ===============FOLLOW AND UNFOLLOW USER=====================
const FollowAndUnfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postId",
      });
    }
    const UserToFollow = await User.findById(userId);
    const LoginUser = await User.findById(req.user._id);

    if (!UserToFollow) {
      return res.status(400).json({
        success: true,
        message: "User Not Found",
      });
    }
    if (LoginUser.following.includes(UserToFollow._id)) {
      const indexOfFollowing = LoginUser.following.indexOf(UserToFollow._id);
      const indexOfFollower = UserToFollow.followers.indexOf(LoginUser._id);

      UserToFollow.followers.splice(indexOfFollower, 1);
      LoginUser.following.splice(indexOfFollowing, 1);

      await LoginUser.save();
      await UserToFollow.save();
      return res.status(200).json({
        success: true,
        message: "Unfollowed",
      });
    } else {
      LoginUser.following.push(UserToFollow._id);
      UserToFollow.followers.push(LoginUser._id);

      await LoginUser.save();
      await UserToFollow.save();

      return res.status(200).json({
        success: true,
        message: "followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================UPDATE USER PROFILE=======================
const UpdateUserProfile = async(req,res) => {
  try {
    const user = await User.findById(req.user._id)
    const {name, email} = req.body
    if(name){
user.name = name
    }
    if(email){
user.email = email
    }
    if(req.files.pimg){
     await cloudinary.uploader.destroy(user.profilePic)
     const file = req.files.pimg;
     const folder = "images";

     const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
    });
    user.profilePic = (await result).url
    }
    await user.save();
    res.status(200).json({
      success: true,
      user: user,
      message: "user upadted ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = {
  RegisterUser,
  LoginUser,
  GetOtherUserProfile,
  GetAllUser,
  MyProfile,
  FollowAndUnfollowUser,
  UpdateUserProfile
};
