import React, { useEffect, useState } from 'react'
import "./Search.scss"
import CloseIcon from '@mui/icons-material/Close';
import User from '../../Pages/Home/User';
import { useDispatch, useSelector } from 'react-redux';
import { FetchAllUsers, FetchMyProfile } from '../../ReduxToolKit/Slice/UserSlice';
import Loading from '../Loading/Loading';

const Search = () => {
  const [name, setName] = useState('')
  const dispatch = useDispatch()

 const users = useSelector((state) => state.user)
 const {Allusers, loading} = users

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(FetchAllUsers({ page: 1, name: name }));
    }, 300); // Delay of 300 milliseconds

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on component unmount
  }, [name, dispatch]);

  return (
    <>
      <div className="search">
        <div className="sub-search">
            <h2>Search for friends</h2>
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <div className="form-control">
                    <input type="text" placeholder='search here...' value={name} onChange={(e) =>setName(e.target.value)} />
<button onClick={() => setName('')}><CloseIcon/></button>
                </div>
            </form>
            <span className='search-btn'>Search Result</span>
<div className="search-result">
{loading && <Loading />} 
{Allusers?.map((user) => (
 <User key={user._id} userId={user._id} name={user.name} pic={user.profilePic} email={user.email} isSearch={true}/>
))}

</div>

        </div>
      </div>
    </>
  )
}

export default Search
