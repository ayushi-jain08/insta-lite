const Post = require("../Model/Post");
const cloudinary = require("../Cloudinary");
const User = require("../Model/User");

const CreatePost = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required." });
    }
    const file = req.files.photo;
    const folder = "images";
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
    });

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const newPost = new Post({
      caption: req.body.caption,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      owner: userId,
    });
    user.posts.unshift(newPost._id);
    await user.save();
    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in CreatePost:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

// =================FETCH MY POST====================
const GetMyPost = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      console.log(user.posts[i]);
      const post = await Post.findById(user.posts[i])
        .populate("comments.user")
        .populate("owner")
        .populate("likes");
      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================GET POST OF FOLOOWING=====================
const GetPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.find({
      owner: {
        $in: user.following,
      },
    })
      .populate("comments.user")
      .populate("owner")
      .populate("likes");
    res.status(200).json({
      success: true,
      posts: post.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============POST OF SINGLE USER======================
const GetSinglePost = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i])
        .populate("comments.user")
        .populate("owner")
        .populate("likes");
      posts.push(post);
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===================LIKE AND UNLIKE POST======================
const LikeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("postId", postId);
    const post = await Post.findById(postId);

    if (!post) {
      res.status(400).json({
        success: true,
        message: "No Post Found",
      });
    }
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);

      await post.save();
      res.status(200).json(post);
    } else {
      post.likes.push(req.user._id);
      await post.save();
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================ADD COMMENT ON POST========================
const AddComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(400).json({
        success: true,
        message: "No Post Found",
      });
    }
    post.comments.push({
      user: req.user._id,
      comment: req.body.comment,
    });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================DELETE COMMENT============================
const DeleteComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.statuspost(400).json({
        success: true,
        message: "No Post Found",
      });
    }
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "comment Id is required",
        });
      }
      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "Selected comment is deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "comment deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ====================DELETE MY ACCOUNT=========================
const DeleteMyAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    await cloudinary.uploader.destroy(user.profilePic);
    await cloudinary.uploader.destroy(user.coverPic);
    await user.deleteOne();

    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await cloudinary.uploader.destroy(post.image.public_id);
      await post.deleteOne();
    }
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // ============REMOVING COMMENTS OF USER FROM ALL POST===================
    const post = await Post.find();
    for (let i = 0; i < post.length; i++) {
      const posts = await Post.findById(post[i]._id);

      for (let j = 0; j < posts.comments.length; j++) {
        if (posts.comments[j].user === userId) {
          posts.comments.splice(j, 1);
          await posts.save();
        }
      }
    }
    // ============REMOVING LIKES OF USER FROM ALL POST===================\
    for (let i = 0; i < post.length; i++) {
      const posts = await Post.findById(post[i]._id);

      for (let j = 0; j < posts.likes.length; j++) {
        if (posts.likes[j] === userId) {
          posts.comments.splice(j, 1);
          await posts.save();
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "profile deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================UPDATE CAPTION=========================
const UpdateCaption = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const post = await Post.findById(id);

    if (!post) {
      res.status(400).json({
        success: true,
        message: "No Post Found",
        post: post,
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.caption = req.body.caption;
    await post.save();
    return res.status(200).json({
      success: true,
      message: "caption updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================DELETE MY POST====================
const DeletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400).json({
        success: true,
        message: "No Post Found",
        post: post,
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await cloudinary.uploader.destroy(post.image.public_id);
    await post.deleteOne();
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });
    res
      .status(200)
      .json({ message: "Post and associated data deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
module.exports = {
  CreatePost,
  GetMyPost,
  GetPostOfFollowing,
  GetSinglePost,
  LikeAndUnlikePost,
  AddComment,
  DeleteComment,
  DeleteMyAccount,
  UpdateCaption,
  DeletePost
};
