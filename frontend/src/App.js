import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Myaccount from "./Components/MyAccount/Myaccount";
import Login from "./Components/Login/Login";
import Search from "./Components/Search/Search";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Components/Loading/Loading";
import SingleUser from "./Components/singleUser/SingleUser";
import PostUpload from "./Components/PostUpload/PostUpload";
import Messenger from "./Components/Chats/Messenger/Messenger";
import {
  addNotification,
  updateChatMessages,
} from "./ReduxToolKit/Slice/ChatSlice";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import EditProfile from "./Components/EditProfile/EditProfile";
import Notification from "./Components/Notification/Notification";
import { addLikeNotification, incrementUnreadNotificationsCount } from "./ReduxToolKit/Slice/PostSlice";

function App() {
  const dispatch = useDispatch();
  const [notif, setNotif] = useState('')
  const socket = useRef();
  const users = useSelector((state) => state.user);
  const { userInfo } = users;
  const storedUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
  const chats = useSelector((state) => state.chat);
  const { msgNotification, ChatMessage } = chats;

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
  }, []);
  useEffect(() => {
    socket.current.emit("addUser", { userId: userInfo._id });
    socket.current.on("getUsers", (users) => {});
    return () => {
      socket.current.disconnect();
    };
  }, [socket]);
  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      dispatch(updateChatMessages(data));
      dispatch(addNotification(data.msg));
    });
  }, [dispatch, userInfo._id, ChatMessage]);
  const CreateNotification = async ({
    userId,
    type,
    postId,
    likedBy,
    message,
  }) => {
    try {
      const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      const response = await fetch(
        `http://localhost:8000/api/notification/like`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${StoredUserInfo.token}`,
          },
          body: JSON.stringify({ userId, type, postId, likedBy, message }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Notification created successfully:", data.notification);
        setNotif(data.notification)
      } else {
        const errorData = await response.json();
        console.error("Error creating notification:", errorData.error);
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };
  useEffect(() => {
    socket.current.on("notification", (data) => {
      console.log("Received notification:", data);
      const message = ` notifictaion: ${data.message}`;
      console.log("me ssage",message)
      CreateNotification({userId:data.ownerId, type:data.type, postId:data.postId, likedBy:data.userId, message:data.message })
      dispatch(incrementUnreadNotificationsCount())
    });
  }, [userInfo._id, socket, dispatch]);

  useEffect(() => {
    socket.current.on("comment notification", (data) => {
      console.log("Received notification:", data);
      const message = ` notifictaion: ${data.message}`;
      CreateNotification({userId:data.ownerId, type:data.type, postId:data.postId, likedBy:data.userId, message:data.message })
      dispatch(incrementUnreadNotificationsCount())
    });
  }, [userInfo._id, socket, dispatch]);
  return (
    <>
      {storedUserInfo ? (
        <>
          {" "}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Myaccount />} />
            <Route path="search" element={<Search/>}/>
            <Route path="/notification" element={<Notification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/user/:userId" element={<SingleUser />} />
            <Route path="/newpost" element={<PostUpload />} />
            <Route path="/chat" element={<Messenger />} />
            <Route path="/update/profile" element={<EditProfile />} />
          </Routes>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
