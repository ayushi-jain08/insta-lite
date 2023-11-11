import React, { useEffect, useRef, useState } from "react";
import "./Home.scss";
import User from "./User";
import Post from "../../Components/Post/Post";
import Profile from "../../Components/Profile/Profile";
import Upload from "../../Components/Upload/Upload";
import Reccomended from "../../Components/Reccomended/Reccomended";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchAllUsers,
  FetchMyProfile,
} from "../../ReduxToolKit/Slice/UserSlice";
import Loading from "../../Components/Loading/Loading";
import { FetchFollowingUserPost } from "../../ReduxToolKit/Slice/PostSlice";
import PostLoading from "../../Components/Post/PostLoading";
import { Skeleton } from "@mui/material";


const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tPages, setTPages] = useState(1);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const { UserDetails, Allusers, loading, totalPage } = userData;
  const posts = useSelector((state) => state.post);
  const { FollowingUserPost, loading:ploading } = posts;

  const storedUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(FetchFollowingUserPost());
      await dispatch(FetchMyProfile());
       dispatch(FetchAllUsers({ page: currentPage, name: "" }));
      setTPages(totalPage);
    };
    if (storedUserInfo) {
      fetchData();
    }
  }, [dispatch, currentPage]);

  return (
    <>
      <div className="home">
      <div className="home-left">
             {loading ? <Skeleton variant="rounded" animation="wave"  width={300} height={300} style={{borderRadius:'15px'}}/>:<Profile userDetails={UserDetails} />}
              <div className="home-bottom">
                <h2>Who is following you</h2>
               {loading ? Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" animation="wave"  width={270} height={30} style={{borderRadius:'5px', marginTop:'10px'}}/>): UserDetails && UserDetails?.followers?.length > 0 ? (
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
            <div className="home-center">
              {ploading ? <Skeleton variant="rounded" animation="wave"  width={500} height={150} style={{borderRadius:'15px'}}/>: <Upload />}
              <div className="center-bottom">
                
             {ploading ? ( Array.from({ length: 5 }).map((_, index) => <PostLoading key={index} />)) :FollowingUserPost && FollowingUserPost.length > 0 ? (
              FollowingUserPost?.map((item) => (
                <Post key={item._id} {...item} isAccount={false}/>
              ))
             ): <p>You have not made any post</p>}
              </div>
            </div>
            <div className="home-right">
              <h2>Other User you may know</h2>
              <div className="all-user">
              {loading ? Array.from({ length: 5 }).map((_, index) => <Skeleton variant="rounded" animation="wave"  width={150} height={150} style={{borderRadius:'15px'}}/>) : Allusers?.map((user) => {
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

export default Home;
