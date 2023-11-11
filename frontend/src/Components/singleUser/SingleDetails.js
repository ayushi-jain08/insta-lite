import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FetchFollowAndUnfollowUser, FetchUserProfile } from '../../ReduxToolKit/Slice/UserSlice';
import './SingleDetails.scss'
import { FetchFollowingUserPost, FetchSingleUserPost } from '../../ReduxToolKit/Slice/PostSlice';

const SingleDetails = ({...otherUserProfile}) => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.user)
  const {userInfo} = users
  const {status, _id, worksAt, livesIn, email, study} = otherUserProfile
  const [following, setFollowing] = useState(false);
const followHandler = async() => {
  setFollowing(!following);
  await dispatch(FetchFollowAndUnfollowUser(_id))
 await dispatch(FetchUserProfile(_id))
 await dispatch(FetchFollowingUserPost())

}
  useEffect(() => {
    if (otherUserProfile) {
      const isFollowing = otherUserProfile?.followers?.some((follower) => follower._id === userInfo._id);
      setFollowing(isFollowing);
    }
  }, [otherUserProfile, userInfo]);
  return (
    <div>
         <div className="single-edit-card">
<div className="info">
<h2>User Info</h2>
</div>
<div className="details" key={_id}>
    <p><strong>status - </strong>{status ?  status: "Unkown"}</p>
    <p><strong>Lives in - </strong>{livesIn}</p>
    <p><strong>Email - </strong>{email}</p>
    <p><strong>study - </strong>{study}</p>
    <p><strong>work at - </strong>{worksAt}</p>
</div>
<button style={{ background: following ? 'green' : 'orangered' }} onClick={followHandler}>{following ? "Unfollow" : "Follow"}</button>
      </div>
    </div>
  )
}

export default SingleDetails
