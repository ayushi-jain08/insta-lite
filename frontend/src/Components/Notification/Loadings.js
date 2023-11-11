import React from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


const Loadings = () => {
  return (
    <div>
       <Box sx={{ width: 1000}} height={80}>
      <Skeleton animation="wave"  height={80}/>
      <Skeleton animation={false}  height={80}/>
    </Box>
    </div>
  )
}

export default Loadings
