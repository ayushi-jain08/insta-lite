const express = require('express');
const auth = require('../Middleware/Auth');
const router = express.Router()
const Notification = require('../Model/Notification');
const { deleteMany } = require('../Model/User');


// ======================POST NOTIFICATION=====================
router.post('/like', auth, async (req, res) => {
    const { userId, type, postId, likedBy, message } = req.body;
  
    try {
      // Create a new notification instance
      const newNotification = new Notification({
        userId,
        type,
        postId,
        likedBy,
        message,
      });
  
      // Save the notification to the database
      await newNotification.save();
  
      res.status(201).json({ message: 'Notification posted successfully', notification: newNotification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ======================GET NOTIFICATION=========================
  router.get('/like', auth, async (req, res) => {
    const userId = req.user._id;
  
    try {
      // Retrieve notifications for the logged-in user (using req.user._id)
      const notifications = await Notification.find({ userId })
        .populate('userId', 'name email profilePic') // Populate user details
        .populate('postId', 'caption image') // Populate post details
        .populate('likedBy', 'name email profilePic') // Populate liking user details
        .sort({ createdAt: -1 });

        if(!notifications){
            res.status(400).json({
                success: "false",
                msg: "No such UserId is found"
            })
        }
  
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========================DELETE ALL NOTIFICATION==============================
  router.delete("/delete-all", auth, async(req,res) => {
    try {
      const userId = req.user._id

      const notification = await Notification.find({userId})
      await Notification.deleteMany({userId});
      
      if (notification.length === 0) {
        return res.status(400).json({
          success: false,
          msg: "No notifications found for the logged-in user.",
        });
      }
      res.status(200).json({ message: "All notifications deleted successfully." })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" })
    }
  })
module.exports = router