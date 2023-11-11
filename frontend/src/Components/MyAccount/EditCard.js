import React, { useEffect, useState } from 'react'
import "./EditCard.scss"
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { FetchFollowAndUnfollowUser, FetchUserProfile, fetchLogout } from '../../ReduxToolKit/Slice/UserSlice';
import { Link } from 'react-router-dom';

const EditCard = ({...UserDetails}) => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.user)
  const {status, _id, worksAt, livesIn, email, study} = UserDetails
   const hanldeLogout = async() => {
await dispatch(fetchLogout())
dispatch(FetchUserProfile())
   }
  return (
    <>
      <div className="edit-card">
<div className="info">
  <h2>Your Info</h2>
  <Link to="/update/profile"><button><EditIcon/></button></Link>
</div>
<div className="details" key={_id}>
    <p><strong>status - </strong>{status ?  status: "Unkown"}</p>
    <p><strong>Lives in - </strong>{livesIn}</p>
    <p><strong>Email - </strong>{email}</p>
    <p><strong>study - </strong>{study}</p>
    <p><strong>work at - </strong>{worksAt}</p>
</div>
<button className='logout' onClick={hanldeLogout}> <span><LogoutIcon/></span>Logout</button>  
      </div>
    </>
  )
}

export default EditCard
