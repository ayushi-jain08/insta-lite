import React, { useEffect, useState } from "react";
import EditCard from "../MyAccount/EditCard";
import User from "../../Pages/Home/User";
import Profile from "../Profile/Profile";
import Post from "../Post/Post";
import Reccomended from "../Reccomended/Reccomended";
import "./SingleUser.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchAllUsers,
  FetchUserProfile,
} from "../../ReduxToolKit/Slice/UserSlice";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import SingleDetails from "./SingleDetails";
import { FetchSingleUserPost } from "../../ReduxToolKit/Slice/PostSlice";
import PostLoading from "../Post/PostLoading";
import { Skeleton } from "@mui/material";

const SingleUser = () => {
  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [tPages, setTPages] = useState(1);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);
  const { Allusers, totalPage, totalUser, loading, otherUserProfile } = users;
  const posts = useSelector((state) => state.post)
  const {SingleUserPost, loading:ploading} = posts
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(FetchAllUsers({ page: currentPage, name: "" }));
      await dispatch(FetchUserProfile(userId));
      await dispatch(FetchSingleUserPost(userId))
      setTPages(totalPage);
    };
    fetchData();
  }, [dispatch, userId]);

  return (
    <>
      <div className="single-user">
      <div className="left">
        {loading ? <Skeleton variant="rounded" animation="wave"  width={300} height={300} style={{borderRadius:'15px'}}/>: <SingleDetails {...otherUserProfile} />}    

              <div className="left-bottom">
                <h2 style={{ fontSize: 20 }}>Who is following User</h2>
              {loading ? Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" animation="wave"  width={270} height={30} style={{borderRadius:'5px', marginTop:'10px'}}/>): otherUserProfile && otherUserProfile?.followers?.length > 0 ? (
                  otherUserProfile?.followers?.map((follower) => (
                    <User
                      key={follower._id}
                      userId={follower._id}
                      name={follower.name}
                      pic={follower.profilePic}
                      email={follower.email}
                    />
                  ))
                ) : (
                  <h5 style={{ fontSize: 20, marginTop: 20, color: "gray" }}>
                    User have no followers!!
                  </h5>
                )}
              </div>
            </div>
            <div className="center">
            {loading ? <Skeleton variant="rounded" animation="wave"  width={500} height={300} style={{borderRadius:'15px'}}/>:   <Profile userDetails={otherUserProfile} isAccount={false}  />}

              <div className="center-bottom">
              {ploading ? ( Array.from({ length: 5 }).map((_, index) => <PostLoading key={index} />)) : SingleUserPost && SingleUserPost.length > 0 ? (
          SingleUserPost?.map((item) => (
            <Post
              key={item?._id}
            {...item}
            isAccount={false}
            isUser={userId}
             
            />
          ))
        ) : (
          <p>You have not made any post</p>
        )}
              </div>
            </div>
            <div className="right">
              <h2>Other User you may know</h2>
              <div className="all-user">
              {loading ? Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" width={140} height={150} style={{borderRadius:'15px'}}/>) : Allusers?.map((user) => {
                  const { name, work, status, _id, profilePic } = user;
                  return (
                    <Reccomended
                      name={name}
                      work={work}
                      pic={profilePic}
                      key={_id}
                      userId={_id}
                      status={status}
                    />
                  );
                })}
              </div>
              <div className="pagination">
                {Array.from({ length: totalPage }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
      </div>
    </>
  );
};

export default SingleUser;
