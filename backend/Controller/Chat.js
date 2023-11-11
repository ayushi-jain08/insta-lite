const Chat = require('../Model/Chat')
const User = require('../Model/User')

// =====================SEND MESSAGE=============================
const SendMessage = async(req,res) => {
    try {
        const {from, to, msg} = req.body
        const NewMessage = new Chat({
            message: msg,
            Chatusers: [from, to],
            sender: from
        })
        await NewMessage.save()
        res.status(200).json(NewMessage) 
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}
// ================GET MESSAGE BETWEEN USERS=========================
const GetMessage = async(req,res) => {
    try {
        const from = req.params.userId1
        const to = req.params.userId2

        const Newmessage = await Chat.find({
            Chatusers: {
                $all : [from, to],
            }
        }).sort({updatedAt:1})

        const Allmessage = Newmessage.map((msg) => {
            return{
                myself: msg.sender.toString() === from,
                message: msg.message
            }
        })
        res.status(200).json(Allmessage)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}
// =======================GET ONLINE USER=====================
const ActiveUser = async (req, res) => {
    const { onlineUsers } = req.body;
    console.log("userIds", onlineUsers);
    try {
      // Fetch users based on userIds array
      const users = await User.find({ _id: { $in: onlineUsers } }).find({_id: {$ne: req.user._id}});
  
      console.log("users", users);
      if (!users) {
        res.status(400).json("No user found");
      }
      // Respond with the user information
      res.status(200).json(users);
    } catch (error) {
      // Handle errors and send an appropriate response
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
module.exports = {SendMessage, GetMessage, ActiveUser}