import React, { useState } from 'react'
import "./Profile.scss"
import cover from "./spice.jpg"
import { Dialog, Typography } from '@mui/material';
import User from '../../Pages/Home/User';

const Profile = ({userDetails, isAccount}) => {
  const [followersToggle, setFollowersToggle] = useState(false);
const [profile, setProfile] = useState(false)
const [post , setPost] = useState(false)
  const [followingToggle, setFollowingToggle] = useState(false);
  const {coverPic, profilePic, name, work, worksAt, following, followers, posts} = userDetails

  if (!userDetails) {
    return <div>Loading...</div>;
  }
  return (
    <div className='profile'>
      <div className="sub-profile">
      <div className="cover">
      <img src={coverPic} alt="" />
      </div>
        <img src={profilePic} alt="" width={50} height={50} className='main-img' onClick={() => setProfile(!profile)}/>
      </div>
      <div className="details">
        <h2>{name}</h2>
        <p> {work}</p>
      </div>
      <div className="sub-details">
        <div>
            <h3>{following?.length}</h3>
           <button onClick={() => setFollowingToggle(!followersToggle)}><p>Following</p></button>
        </div>
        <div className='middle'>
            <h3>{followers?.length}</h3>
           <button onClick={() => setFollowersToggle(!followersToggle)}> <p>Follower</p></button>
        </div>
        <div>
            <h3>{posts?.length}</h3>
           <button onClick={() => setPost(!post)}>
           <p>Posts</p>
           </button>
        </div>
      </div>
      <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followings</Typography>

            {following?.length > 0 ? (
              following?.map((followings) => (
                <User
                  key={followings._id}
                  userId={followings._id}
                  email={followings.email}
                  name={followings.name}
                  pic={followings.profilePic}
                  
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
             {isAccount ? "You are not following anyone":" User is not following anyone"}
              </Typography>
            )}
          </div>
        </Dialog>
      <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>

            {followers?.length > 0 ? (
              followers?.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  email={follower.email}
                  name={follower.name}
                  pic={follower.profilePic}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
              {isAccount ? "   You have no followers":" User have no follower"}
               </Typography>
             )}
           
          
          </div>
        </Dialog>
        <Dialog open={profile} onClose={() => setProfile(!profile)} style={{width:''}}>
<div className="pic-box" style={{width:'500px' , height:'450px', overflow:'hidden'}}>
  <img src={profilePic} alt="" style={{width:'100%' , height:'100%', objectFit:'cover'}} />
</div>
        </Dialog>
        <Dialog open={post} onClose={() => setPost(!post)}>
      <div className="all-post" style={{padding:'10px'}}>
      <h2>All Posts</h2>
      <div className="posts-img" style={{display:'flex', flexWrap:'wrap' ,justifyContent:'space-between', marginTop:'10px'}}>
      {posts?.map((item) => (
        <img src={item.image.url} alt="" width={130} height={120} style={{border:'1px solid black', margin:'5px'}} key={item._id}/>
      ))}
      </div>
      </div>
        </Dialog>
    </div>
  )
}

export default Profile
