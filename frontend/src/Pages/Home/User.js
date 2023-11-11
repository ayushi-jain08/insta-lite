import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import log1 from "./log.png";
import "./User.scss";
import { useDispatch, useSelector } from "react-redux";
import { FetchFollowAndUnfollowUser, FetchMyProfile, FetchUserProfile } from "../../ReduxToolKit/Slice/UserSlice";
import Loading from "../../Components/Loading/Loading";
import { FetchFollowingUserPost } from "../../ReduxToolKit/Slice/PostSlice";
const User = ({ userId, name, pic, email, isSearch }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const users = useSelector((state) => state.user)
  const {userInfo,UserDetails} = users
  const [following, setFollowing] = useState(false);
  const handleFollow = async(id) => {
    setFollowing(!following)
    setLoading(true)
    await dispatch(FetchFollowAndUnfollowUser(id))
   await dispatch(FetchMyProfile())
   await dispatch(FetchUserProfile(id))
   dispatch(FetchFollowingUserPost())
    setLoading(false)
  }
 
  useEffect(() => {
    if (UserDetails) {
      const isFollowing = UserDetails?.following?.some((follower) => follower._id === userId);
      setFollowing(isFollowing);
    }
  }, [UserDetails, userInfo]);
  return (
 <>
 {loading ? <Loading/>: <div className="user" key={userId}>
   <div className="user-details">
     <img src={pic} alt="user" width={50} height={50} />
     <Link to={userId === userInfo._id ? "/account" :`/user/${userId}`}>
     <div className="detail">
 <p className="name">{name}</p>
 <p style={{ fontSize: 12,fontStyle:'italic'}}>{email}</p>
</div>
</Link>
   </div>
{isSearch ? "" :  userId !== userInfo._id &&  <button className="follow" style={{ background: following ? 'purple' : 'orangered' }} onClick={() => handleFollow(userId)}>{following ? "Unfollow" : "Follow"}</button> }
 </div>}
 </>
 

  );
};

export default User;
