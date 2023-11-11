import { Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material";
import { Avatar, Button, Typography, Dialog, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import log2 from "./spice.jpg";
import "./Post.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import User from "../../Pages/Home/User";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  AddCommentOnPost,
  FetchDeleteMyPost,
  FetchFollowingUserPost,
  FetchLikeUnlikePost,
  FetchMyPost,
  FetchSingleUserPost,
  FetchUpdatecaption,
  addLikeNotification,
  addNotification,
} from "../../ReduxToolKit/Slice/PostSlice";
import CommentCard from "../CommentCard/CommentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { FetchMyProfile } from "../../ReduxToolKit/Slice/UserSlice";

const Post = ({ ...item }) => {
  const {
    _id,
    caption,
    image,
    likes = [],
    comments,
    owner,
    isAccount,
    isUser,
  } = item;
  const users = useSelector((state) => state.user);
  const { userInfo } = users;
  const socket = useRef();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);
  const [Edit, setEdit] = useState(false);

  const posts = useSelector((state) => state.post);
  const { message } = posts;

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

  // ====================SCROLL POSITION====================
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==================POST LIKE=======================
  const handlePostLike = async () => {
    setLiked(!liked);
    const hasLiked = likes.some((like) => like._id === userInfo._id);
    window.scrollTo(0, scrollPosition);
     dispatch(FetchLikeUnlikePost(_id));
    if (isAccount) {
      dispatch(FetchMyPost());
    } else {
      dispatch(FetchFollowingUserPost());
    }
    if (isUser !== undefined) {
      dispatch(FetchSingleUserPost(isUser));
    }
    if (hasLiked) {
      return;
    }
    if (owner._id === userInfo._id) {
      return;
    }
    socket.current.emit("likePost", {
      postId: _id,
      ownerId: owner._id,
      name: userInfo.name,
      userId: userInfo._id,
    });
    console.log("id", _id, "ownerId", owner._id, "name", userInfo.name);
  
  };
  //  ===============ADD COMMENT=================
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentValue) {
      await dispatch(AddCommentOnPost({ postId: _id, comment: commentValue }));
      socket.current.emit("commentPost", {
        postId: _id,
        ownerId: owner._id,
        name: userInfo.name,
        userId: userInfo._id,
        comment: commentValue,
      });
    }
      toast.success("You commented");
      setCommentValue("");
      window.scrollTo(0, scrollPosition);
      if (isAccount) {
        dispatch(FetchMyPost());
      } else {
        dispatch(FetchFollowingUserPost());
      }
      if (isUser !== undefined) {
        dispatch(FetchSingleUserPost(isUser));
      } else {
        return;
      }
      if (owner._id === userInfo._id) {
        return;
      }

    
  };
  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === userInfo._id) {
        setLiked(true);
      }
    });
  }, [liked, userInfo._id, likes]);

  // ======================POST DELETE======================
  const postDeleteHandler = async () => {
    await dispatch(FetchDeleteMyPost(_id));
    await dispatch(FetchMyPost());
    await dispatch(FetchMyProfile());
    toast.warning(message);
  };
  const updateCaptionHandler = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Your logic to dispatch the update caption action
    await dispatch(FetchUpdatecaption({ id: _id, caption: captionValue }));
    await dispatch(FetchMyPost());

    // Optionally close the dialog or perform other actions after the form submission

    // If you're using Material-UI Dialog, you can close it like this:
    setCaptionToggle(false);
  };

  return (
    <>
      <div className="post">
        <div className="postHeader">
          {isAccount ? (
            <Tooltip title="More">
              <button onClick={() => setEdit(!Edit)} className="more-vert">
                <MoreVert />
              </button>
            </Tooltip>
          ) : null}
          {Edit ? (
            <div className="edit-box">
              <button onClick={() => setCaptionToggle(!captionToggle)}>
                Edit Caption
              </button>
              <button onClick={postDeleteHandler}>Delete Post</button>
            </div>
          ) : (
            ""
          )}
        </div>
        <img
          src={image?.url}
          alt=""
          width={200}
          height={200}
          className="post-img"
        />
        <div className="post-details">
          <img
            src={owner?.profilePic}
            alt=""
            width={45}
            height={45}
            style={{ borderRadius: "50%" }}
          />

          <div>
            <Link to={``}>
              <Typography fontWeight={700}>{owner?.name}</Typography>
            </Link>

            <Typography
              fontWeight={700}
              color="rgba(0, 0, 0, 0.582)"
              style={{ alignSelf: "center" }}
            >
              {caption}
            </Typography>
          </div>
        </div>
        <div className="post-footer">
          <button onClick={handlePostLike}>
            {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
          </button>

          <button onClick={() => setCommentToggle(!commentToggle)}>
            <CommentIcon />
          </button>
        </div>
        <button
          className="likes"
          onClick={() => setLikesUser(!likesUser)}
          disabled={likes.length === 0 ? true : false}
        >
          <Typography
            style={{ fontSize: 15, fontWeight: 600, fontFamily: "sans-serif" }}
          >
            {likes?.length} Likes
          </Typography>
        </button>

        <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
          <div className="DialogBox">
            <Typography variant="h4">Liked By</Typography>
            {likes.map((like) => (
              <User
                key={like._id}
                userId={like._id}
                name={like.name}
                pic={like.profilePic}
                email={like.email}
              />
            ))}
          </div>
        </Dialog>
        <Dialog
          open={commentToggle}
          onClose={() => setCommentToggle(!commentToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Comments</Typography>

            <form className="commentForm">
              <input
                type="text"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                placeholder="Comment Here..."
                required
              />

              <button
                type="submit"
                className="send-btn"
                onClick={handleAddComment}
              >
                <SendIcon />
              </button>
            </form>

            {comments && comments.length > 0 ? (
              comments.map((item) => (
                <CommentCard
                  userId={item.user?._id}
                  name={item.user?.name}
                  avatar={item.user?.profilePic}
                  comment={item.comment}
                  commentId={item._id}
                  key={item._id}
                  postId={_id}
                  isAccount={isAccount}
                  isUser={isUser}
                />
              ))
            ) : (
              <Typography>No comments Yet</Typography>
            )}
          </div>
        </Dialog>
      </div>
      <ToastContainer />
      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <p style={{ fontSize: "20px" }}>Update Caption</p>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
              style={{ padding: "10px" }}
            />

            <button
              type="submit"
              className="send-btn"
              style={{ padding: "10px" }}
            >
              Update
            </button>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default Post;
