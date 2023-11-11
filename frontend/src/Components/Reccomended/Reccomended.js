import React from 'react'
import "./Reccommended.scss"
import spice from "./spice.jpg"
import { NavLink } from 'react-router-dom'

const Reccomended = ({name, work, status, userId, pic}) => {
  return (
    <>
      <div className="reccomend">
<img src={pic} alt="" />
<h2>{name}</h2>
<h4>{work}</h4>
<h4>{status}</h4>
<NavLink to={`/user/${userId}`}>
<button className='profile'>Profile</button>
</NavLink>
</div>

      
    </>
  )
}

export default Reccomended
