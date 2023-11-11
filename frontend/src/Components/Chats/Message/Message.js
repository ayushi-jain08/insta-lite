import React, { useEffect, useRef } from 'react'
import "./Message.scss"
import { useSelector } from 'react-redux'


const Message = ({ currentChatUser, ChatMessage}) => {
   const users = useSelector((state) => state.user)
   const {UserDetails} = users
   const scrollRef = useRef()

   useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
   },[ChatMessage])
  return (
    <>
  {ChatMessage && ChatMessage?.map((chat, index) => (
      chat?.myself ? <div className= "message own" key={index} >
       <div className="message-top" ref={scrollRef}>
           <p className='msg-text'>{chat.message}</p>
           <img src={UserDetails?.profilePic} alt=""  className='msg-img'/>
       </div>
             </div>: 
       <div className= "message"  key={index}>
       <div className="message-top">
           <img src={currentChatUser?.profilePic} alt=""  className='msg-img'/>
           <p className='msg-text'>{chat.message}</p>
       </div>
       </div>
  ))}
    </>
  )
}

export default Message
