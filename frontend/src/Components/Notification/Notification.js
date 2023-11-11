import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteAllNotification, FetchNotification, clearCountNotification, clearLikeNotifications } from '../../ReduxToolKit/Slice/PostSlice'
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./Notification.scss"
import Loadings from './Loadings';
import NotificationCard from './NotificationCard';
import Skeleton from '@mui/material/Skeleton';

const Notification = () => {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.user)
    const {UserInfo} = users
    const posts = useSelector((state) => state.post)
    const {  AllNotification, loading} = posts

useEffect(() => {
dispatch(FetchNotification())
dispatch(clearCountNotification())
},[dispatch,])
console.log('all', AllNotification)

const handleDeletNotification = async() => {
  await dispatch(DeleteAllNotification())
  dispatch(FetchNotification())
}
  return (
    <>
   <div className="all-notification">
   <div className="notification">
  <div className="header">
 <div className='header-left'>
 <h2>Notifications</h2>
  <p><NotificationsIcon/></p>
 </div>
{loading ? <Skeleton animation="wave"  height={50} width={200}/> : AllNotification.length !== 0 &&  <button className='clear' onClick={handleDeletNotification}>Clear All Notification</button>}
  </div>
  <div className="details">
  {loading ? <Loadings/> : AllNotification.length !== 0 ? AllNotification?.map((notif) => (
   <>
    <NotificationCard {...notif}/>
   </>
    )): <p>No Notification</p>}
  </div>
  
    </div>
   </div>
     
    </>
  )
}

export default Notification
