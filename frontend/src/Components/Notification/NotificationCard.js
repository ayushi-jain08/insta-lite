import React from 'react'
import { Link } from 'react-router-dom';
import "./Notification.scss"

const NotificationCard = ({...notif}) => {
  return (
    <>
      <div className='notif-details' key={notif._id}>
        <div className="sub-details">
      <img src={notif.likedBy.profilePic} alt="likedBy" className='likedBy-user' />
      {notif.type === "comment" ? <div>
      <Link to={`/user/${notif.likedBy._id}`}>
      <p style={{fontWeight:700}}>{notif.likedBy.name} commented on your post</p>
       </Link>
       <p style={{color:'gray'}}>Comment : {notif.message}</p>
        <p style={{color:'gray'}}>{notif.postId.caption}</p>
      </div> : <div>
      <Link to={`/user/${notif.likedBy._id}`}><p style={{fontWeight:700}}>{notif.message}</p></Link>
        <p style={{color:'gray'}}>{notif.postId.caption}</p>
      </div>}
      </div>
      <img src={notif.postId.image.url} alt="post img" className='post-img'/>
     
    </div>
    </>
  )
}

export default NotificationCard
