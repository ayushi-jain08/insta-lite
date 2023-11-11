import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import User from "../../../Pages/Home/User";
import "./Conversation.scss";
import Loading from "../../Loading/Loading";

const Conversation = ({ onClick , Allusers, currentChatUser}) => {
  useEffect(() => {
    if(currentChatUser){
      
    }
  })
  return (
    <>
     <div className="conv-users" >
      {Allusers?.map((user) => (
        <div className={currentChatUser  === user ? "conversation active" : "conversation"} onClick={() => onClick(user)} key={user._id}>
          <img src={user.profilePic} alt="" width={50} height={50} />
          <div className="users">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Conversation;
