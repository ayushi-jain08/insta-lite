import React from "react";
import "./CommentCard.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Delete } from "@mui/icons-material";
import { DeleteCommentOnPost, FetchFollowingUserPost, FetchMyPost, FetchSingleUserPost } from "../../ReduxToolKit/Slice/PostSlice";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,
  isUser,
}) => {
const users = useSelector((state) => state.user)
const {userInfo} = users
const dispatch = useDispatch()
    const deleteCommentHandle = async() => {
      dispatch(DeleteCommentOnPost({postId, commentId}))
      if(isAccount){
        dispatch(FetchMyPost())
            }else{
              dispatch(FetchFollowingUserPost())
            }
            if(isUser !== ""){
              dispatch(FetchSingleUserPost(isUser))
            }
    }
  return (
    <>
      <div className="comment-card">
       <div className="sub-card">
       <img src={avatar} alt=""  />
        <div className="details">
        <Link to={userId === userInfo._id ? "/account" :`/user/${userId}`}>
          <p>{name}</p>
        </Link>
        <h5>{comment}</h5>
        </div>
       </div>
       {isAccount ? (
        <button onClick={deleteCommentHandle} className="delete-btn">
          <Delete />
        </button>
      ) : userId === userInfo._id ? (
        <button onClick={deleteCommentHandle} className="delete-btn">
          <Delete />
        </button>
      ) : null}
      </div>
    </>
  );
};

export default CommentCard;
