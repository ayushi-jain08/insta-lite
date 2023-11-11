import React from 'react'
import Skeleton from '@mui/material/Skeleton';

const PostLoading = () => {
  return (
    <div style={{marginTop:'15px'}}>
          <Skeleton sx={{ height: 220 }} animation="wave" variant="rectangular" width={500} style={{borderRadius:'15px'}} />
        <div style={{display:'flex', marginTop:'10px'}}>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />

<div>
   <Skeleton animation="wave" height={15} style={{ marginBottom: 1 }}  width={100}/>
   <Skeleton animation="wave" height={15} width={200} />
 </div>

        </div>
    </div>
  )
}

export default PostLoading
