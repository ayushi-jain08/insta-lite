const cors = require("cors");

const io = require("socket.io")(5000, {
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUser", ({ userId }) => {
  
    addUser(userId, socket.id);
  
    io.emit("getUsers", users);
  });
  
  socket.on("likePost", ({ postId, ownerId, name, userId }) => {
    const owner = getUser(ownerId);
    console.log("yyyyyyyyyyyyyyy")
    console.log("User found:", owner);
    console.log("userId", ownerId);
    console.log("userId", userId);
    console.log("wowwwwwwwwwwww")
    if (owner) {
      io.to(owner.socketId).emit("notification", {
        type: "like",
        postId,
        userId,
        ownerId,
        message: `${name} liked your post!`,
      });
    } else {
      console.error("User not found");
    }
  });

  socket.on("commentPost", ({ postId, ownerId, name, userId, comment }) => {
    const owner = getUser(ownerId);
    console.log("User found:", owner);
    console.log("userId", ownerId);
    console.log("userId", userId);
    console.log("comment", comment);

    if (owner) {
      io.to(owner.socketId).emit("comment notification", {
        type: "comment",
        postId,
        userId,
        ownerId,
        message: `${comment}`,
      });
      console.log("comment on your post");
    } else {
      console.error("User not found");
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, name, text, comment }) => {
    const user = getUser(receiverId);
    console.log("text", text);
    console.log(name);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        msg: `message from ${name}.`,
      });
    } else {
      console.error("User not found");
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getusers", users);
  });
});
