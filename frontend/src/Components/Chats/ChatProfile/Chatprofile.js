import React from "react";
import "./ChatProfile.scss";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";

const Chatprofile = ({ showProfile, currentChatUser }) => {
  return (
    <>
      <div className="chat-profile">
        <div className="chat-container">
          <div className="top">
            <span>Contact Info</span>
            <button
              className="close-dot"
              onClick={() => showProfile(!showProfile)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="center">
            <img src={currentChatUser.profilePic} alt="" />
            <div className="detail">
              <p>{currentChatUser.name}</p>
              <span>{currentChatUser.email}</span>
            </div>
          </div>
          <div className="center-bottom">
            <div className="about">
              <h2>About</h2>
              <p><strong>status - </strong>{currentChatUser?.status ?  currentChatUser?.status: "Unkown"}</p>
    <p><strong>Lives in - </strong>{currentChatUser?.livesIn}</p>
    <p><strong>study - </strong>{currentChatUser?.study}</p>
    <p><strong>work at - </strong>{currentChatUser?.worksAt}</p>
            </div>
          </div>
          <div className="bottom">
            <div>
              <h3>{currentChatUser?.following?.length}</h3>
              <p>Following</p>
            </div>
            <div className="middle">
              <h3>{currentChatUser?.followers?.length}</h3>
              <p>Follower</p>
            </div>
            <div>
              <h3>{currentChatUser?.posts?.length}</h3>
              <p>Posts</p>
            </div>
          </div>
          <NavLink to={`/user/${currentChatUser._id}`}><button className="go-to-profile">Go to user Profile</button></NavLink>
        </div>
      </div>
    </>
  );
};

export default Chatprofile;
