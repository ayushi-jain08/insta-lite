import React, { useEffect, useRef, useState } from 'react'
import Conversation from '../conversation/Conversation'
import "./Messenger.scss"
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Message from '../Message/Message';
import SendIcon from '@mui/icons-material/Send';
import ChatOnline from '../ChatOnline/ChatOnline';
import { useDispatch, useSelector } from 'react-redux';
import { FetchGetMessage, FetchSensMessage, addNotification, clearNotifications, updateChatMessages } from '../../../ReduxToolKit/Slice/ChatSlice';
import { FetchAllUsers } from '../../../ReduxToolKit/Slice/UserSlice';
import { io } from "socket.io-client";
import Loading from '../../Loading/Loading';
import beepSound from "../../beep.mp3"
import Chatprofile from '../ChatProfile/Chatprofile';

const Messenger = () => {
  const socket = useRef();
    const dispatch = useDispatch()
    const [showProfile, setShowProfile] = useState(false)
    const [search, setSearch] = useState('')
    const audioRef = useRef(new Audio(beepSound));
    const [onlineUsers, setOnlineUsers] = useState('');
    const [arrivalMessage, setarrivalMessage] = useState(null);
    const [inputMessage, setInputMessage] = useState('')
    const [currentChatUser, setCurrentChatUser] = useState("")
    const [message, setMessage] = useState()
    const users = useSelector((state) => state.user)
    const {userInfo,Allusers , loading:uloading} = users
const chats = useSelector((state) => state.chat)
const { ChatMessage, loading, msgNotification} = chats

useEffect(() => {
socket.current = io("ws://localhost:5000")
},[])

const playNotificationSound = () => {
  audioRef.current.play();
};
useEffect(() => {
  socket.current.on("getMessage", (data) => {
    setarrivalMessage(data)
    dispatch(updateChatMessages(data));
    dispatch(addNotification(data.msg))
    playNotificationSound();
  });
  return () => {
    socket.current.off("getMessage");
  };
}, [dispatch, ChatMessage, arrivalMessage]);
useEffect(() => {
  socket.current.emit("addUser", {userId:userInfo._id});
  socket.current.on("getUsers", (users) => {
    const userIds = users.map(item => item.userId).filter(userId => userId);
    setOnlineUsers(userIds)
  });
  return () => {
    socket.current.disconnect();
  };
}, [socket]);

    const handleClick = async(e) => {
setCurrentChatUser(e)
    }
    
console.log("currentUser", currentChatUser)
    const handleSendMsg = async(e) => {
        e.preventDefault()
        if(inputMessage && currentChatUser){
         try {
          socket.current.emit("sendMessage", {
            senderId: userInfo._id,
            receiverId: currentChatUser._id,
            name: userInfo.name,
            text: inputMessage,
          });
           await dispatch(FetchSensMessage({from:userInfo._id, to:currentChatUser._id, msg:inputMessage}))
           await dispatch(FetchGetMessage({userId1:userInfo._id, userId2:currentChatUser._id}))
            setInputMessage("");
         } catch (error) {
          console.error("Error fetching messages:", error);
         }
        }
    }
   
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    dispatch(FetchAllUsers({ page: 1, name: search }));
  }, 300); // Delay of 300 milliseconds

  return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on component unmount
},[dispatch, search])

useEffect(() => {
  dispatch(FetchGetMessage({userId1:userInfo._id, userId2:currentChatUser._id}))
},[currentChatUser._id, userInfo._id, dispatch, arrivalMessage])

useEffect(() => {
  dispatch(clearNotifications())
},[dispatch, arrivalMessage])
  return (
    <>
      <div className="messenger">
        <div className="chat-menu">
            <div className="chat-wrapper">
          <div className="form-group">
<SearchIcon />
          <input
              type="text"
              placeholder="Search for friends"
              className="chatmenu-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          </div>
       {uloading ? <Loading/> :   <div className='conversion' >
         <Conversation onClick={handleClick} Allusers={Allusers} currentChatUser={currentChatUser}/>
         </div>}
        </div>
        <div className="chat-box">
           {currentChatUser !== "" ?  <div className="chat-box-wrapper">
                <div className="chat-box-top">
                 <div className="left-side">
                 <img src={currentChatUser?.profilePic} alt="" />
                    <h5>{currentChatUser?.name}</h5>
                 </div>
                 <div className="right-side">
                    <button onClick={() => setShowProfile(!showProfile)} className='dot-icon'><MoreVertIcon/></button>
                    {showProfile && <Chatprofile showProfile={setShowProfile} currentChatUser={currentChatUser}/>}
                 </div>
                </div>
                {loading ? <Loading/>: <div className="chat-box-center">
                <Message currentChatUser={currentChatUser} ChatMessage={ChatMessage}/>
                </div>}
                <div className="chat-box-bottom">
                <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    value={inputMessage}
                    onChange={(e) =>setInputMessage(e.target.value)}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSendMsg}>
                    <SendIcon/>
                  </button>
                </div>
            </div>:  <span className="noConversationText">
                Open a conversation to start a chat !!
              </span>}
        </div>
        <div className="chat-online">
            <ChatOnline onlineUsers={onlineUsers}/>
        </div>
      </div>
    </>
  )
}

export default Messenger
