import React, { useEffect, useState } from "react";
import "./Myacoount.scss";
import Profile from "../Profile/Profile";
import User from "../../Pages/Home/User";
import Post from "../Post/Post";
import Upload from "../Upload/Upload";
import "../Upload/Upload.scss";
import Reccomended from "../Reccomended/Reccomended";
import MyUpload from "./MyUpload";
import EditCard from "./EditCard";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchAllUsers,
  FetchMyProfile,
} from "../../ReduxToolKit/Slice/UserSlice";
import Loading from "../Loading/Loading";
import { FetchMyPost } from "../../ReduxToolKit/Slice/PostSlice";
import PostLoading from "../Post/PostLoading";
import { Skeleton } from "@mui/material";

const Myaccount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tPages, setTPages] = useState(1);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const { UserDetails, Allusers, totalPage, totalUser, loading } = userData
  const posts = useSelector((state) => state.post)
  const {MyPost, loading:ploading} = posts 

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(FetchMyProfile());
      await dispatch(FetchMyPost());
      await dispatch(FetchAllUsers({ page: currentPage, name: "" }));
      setTPages(totalPage);
    };
    fetchData();
  }, [dispatch, currentPage]);
  const numberOfPosts = MyPost.length;

console.log(`Number of posts: ${numberOfPosts}`);

  return (
    <div className="account">
             <div className="left">
            {loading ? <Skeleton variant="rounded" animation="wave"  width={300} height={300} style={{borderRadius:'15px'}}/>: <EditCard key={UserDetails._id} {...UserDetails} />}

            <div className="left-bottom">
              <h2 style={{ fontSize: 20 }}>Who is following you</h2>
              {loading ? Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" width={270} height={30} style={{borderRadius:'5px', marginTop:'10px'}}/>) : UserDetails && UserDetails?.followers?.length > 0 ? (
                UserDetails?.followers?.map((follower) => (
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
                  You have no followers
                </h5>
              )}
            </div>
          </div>
          <div className="center">
      {loading ? <Skeleton variant="rounded" animation="wave"  width={500} height={300} style={{borderRadius:'15px'}}/>: <Profile userDetails={UserDetails} isAccount={true} />}

      {ploading ? <Skeleton variant="rounded" animation="wave"  width={500} height={150} style={{borderRadius:'15px'}}/> : <MyUpload />}
      <div className="center-bottom">
        {ploading ? (
          // Render loading skeletons for each post while data is being fetched
          Array.from({ length: 5 }).map((_, index) => <PostLoading key={index} />)
        ) : MyPost && MyPost.length > 0 ? (
          MyPost.map((item) => (
            <Post key={item?._id} {...item} isAccount={true} />
          ))
        ) : (
          <p>You have not made any post</p>
        )}
      </div>
    </div>
          <div className="right">
            <h2>Other User you may know</h2>
            <div className="all-user">
            {loading ?  Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" animation="wave"  width={150} height={150} style={{borderRadius:'15px'}}/>): Allusers?.map((user) => {
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
  );
};

export default Myaccount;
