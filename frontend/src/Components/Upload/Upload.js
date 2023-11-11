import React from 'react'
import "./Upload.scss"
import log from "./spice.jpg"
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { NavLink } from 'react-router-dom';
const Upload = () => {
  return (
    <>
      <div className="upload">
      <div className="left">
        <img src={log} alt="" width={50} height={50}/>
      </div>
        <div className="right">
<NavLink to="/newpost">
<input type="text" placeholder='Post here...' />
<div className='icons'>
<div className="sub-icons">
<span style={{fontWeight:600}}>
<CropOriginalIcon style={{color:'green'}}/>
Photo
</span>
<span style={{fontWeight:600}}> 
<VideoCameraFrontIcon style={{color:'purple'}}/>
Video
</span>
</div>
<button className='share'>share</button>
</div>
</NavLink>

        </div>
       
      </div>
    </>
  )
}

export default Upload
