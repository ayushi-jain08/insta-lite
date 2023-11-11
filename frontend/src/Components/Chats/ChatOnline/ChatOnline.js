import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import User from '../../../Pages/Home/User'
import "./ChatOnline.scss"
import { FetchActiveUser } from '../../../ReduxToolKit/Slice/ChatSlice'
import Loading from '../../Loading/Loading'

const ChatOnline = ({onlineUsers}) => {
  const dispatch = useDispatch()
  const [activeUsers, setActiveUsers] = useState([])
   const [loading, setLoading] = useState(false)


    useEffect(() => {
      const onlineUser = async () => {
        if(onlineUsers !== ""){
          try {
            const StoredUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
            setLoading(true)
            const response = await fetch(`http://localhost:8000/api/chat/activeuser`, {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StoredUserInfo.token}`,
              },
              body: JSON.stringify({ onlineUsers }),
            });
            const data = await response.json();
            if (response.ok) {
              setActiveUsers(data)
              setLoading(false)
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            console.error("An error occurred while processing your request.", error);
            // Handle error state here if needed
          }
        }
      };
  
      onlineUser(); 
    }, [onlineUsers]);
  return (
    <>
       <div className="chatOnline">
        <h2>Online Users</h2>
        </div>
       {loading ? <Loading/> : <div className="chatOnlineFriend" >
          {activeUsers && activeUsers.length > 0 ? activeUsers.map((user) => (
 <div className="online" key={user._id}>
 <img src={user.profilePic} alt=""  width={50} height={50}/>
 <div className="online-user">
     <h2>{user.name}</h2>
     <p>{user.email}</p>
 </div>
 <div className="badge"></div>
</div>
          )): <div className='no-online'><p>No user Online..!!</p></div>}
          </div>}
      
   

    </>
  )
}

export default ChatOnline

