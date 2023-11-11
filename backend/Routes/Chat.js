const express = require('express')
const auth = require('../Middleware/Auth')
const { SendMessage, GetMessage, ActiveUser } = require('../Controller/Chat')
const router = express.Router()

router.post('/msg', auth, SendMessage)
router.get('/get/msg/:userId1/:userId2', auth, GetMessage)
router.post("/activeuser", auth, ActiveUser)
module.exports = router