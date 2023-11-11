const express = require('express')
const { RegisterUser, LoginUser, GetOtherUserProfile, GetAllUser, MyProfile, FollowAndUnfollowUser, UpdateUserProfile } = require('../Controller/User')
const auth = require('../Middleware/Auth')
const router = express.Router()

router.post("/register", RegisterUser )
router.post("/login", LoginUser )
router.get("/:userId", auth, GetOtherUserProfile)
router.get("/all/users", auth, GetAllUser )
router.get("/my/profile", auth, MyProfile)
router.get("/follow/:userId", auth, FollowAndUnfollowUser)
router.patch("/update" , auth, UpdateUserProfile)

module.exports = router
