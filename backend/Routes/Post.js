const express = require('express')
const auth = require('../Middleware/Auth')
const { CreatePost, GetMyPost, GetPostOfFollowing, GetSinglePost, LikeAndUnlikePost, AddComment, DeleteComment, DeleteMyAccount, UpdateCaption, DeletePost } = require('../Controller/Post')
const { UpdateUserProfile } = require('../Controller/User')
const router = express.Router()

router.post("/create", auth, CreatePost)
router.get("/mypost", auth, GetMyPost)
router.get("/following", auth, GetPostOfFollowing)
router.get("/userposts/:userId", auth, GetSinglePost)
router.get("/like/:postId", auth, LikeAndUnlikePost)
router.post("/comment/:postId", auth, AddComment)
router.delete("/delete/:postId", auth, DeleteComment)
router.delete("/delete", auth, DeleteMyAccount)
router.put("/updateprofile", auth, UpdateUserProfile)
router.put("/updatecaption/:id", auth,UpdateCaption )
router.delete("/deletepost/:postId", auth,DeletePost)

 module.exports = router 