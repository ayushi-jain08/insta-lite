import React, { useEffect } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import "./Navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../ReduxToolKit/Slice/UserSlice";
import { Badge } from "@mui/material";

const Navbar = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat)
  const {unreadCount,msgNotification } = chats
  const posts = useSelector((state) => state.post)
  const { unreadNotification} = posts
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
    if (storedUserInfo) {
      dispatch(setUserInfo(storedUserInfo));
    }
  }, [dispatch]);
  
  const notificationMessage = msgNotification.join('\n');

  return (
    <>
      <div className="navbar">
        <div className="sub-navbar">
          <div className="left">
            <div className="logo">
              <h2>Meta</h2>
              <TwitterIcon />
            </div>
          </div>
          <div className="center">
            <form>
              <NavLink to="/search">
                <div className="form-control">
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="search here..."
                  />
                 <button> <SearchIcon /></button>
                </div>
              </NavLink>
            </form>
          </div>
          <div className="right">
            <NavLink to="/">
              <HomeIcon />
            </NavLink>
            <NavLink to="/notification">
             {unreadNotification > 0 ?<Badge badgeContent={unreadNotification} color="primary">
             <NotificationsIcon />
</Badge>:  <NotificationsIcon />}
            </NavLink>
            <NavLink to="/account">
              <AccountCircleIcon />
            </NavLink>
            <NavLink to="/chat">
            {unreadCount > 0 ? <div className="badge">
            <ChatIcon/>
          <div>
          {notificationMessage.split('.').map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </div>
            <p>{unreadCount}</p>
            </div>
    :<ChatIcon/>}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
