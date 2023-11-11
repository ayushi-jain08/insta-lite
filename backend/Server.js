const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ConnectDb = require("./Config")
const fileUpload  = require('express-fileupload')
const user = require('./Routes/User')
const post = require('./Routes/Post')
const chat= require('./Routes/Chat')
const notification = require("./Routes/Notification")

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(fileUpload({
    useTempFiles:true
}))

app.use("/api/user", user)
app.use("/api/post", post)
app.use("/api/chat", chat)
app.use("/api/notification", notification)
ConnectDb()

const server = app.listen(process.env.PORT, async() => {
    console.log("server is running")
})