import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MailOutlineTwoToneIcon from '@mui/icons-material/MailOutlineTwoTone';
import HttpsTwoToneIcon from '@mui/icons-material/HttpsTwoTone';
import log1 from "./log.png"
import "./Login.scss"
import { useDispatch, useSelector } from 'react-redux';
import { FetchMyProfile, fetchLogin } from '../../ReduxToolKit/Slice/UserSlice';
import Loading from '../Loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
const selector = useSelector((state) => state.user)
const {userInfo, loading, error, loggedIn} = selector

    const handleSubmit = async(e) => {
        e.preventDefault()
      if(!email || !password){
        alert("please fill all data")
      }else{
      await  dispatch(fetchLogin({email,password}))
      navigate("/")
        dispatch(FetchMyProfile());
      }
    }
    useEffect(() => {
      const storedUserInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
      if(storedUserInfo){
        dispatch(FetchMyProfile());
        toast.success("Successfully Login")
        navigate("/")
      }
    },[])
  return (
    <>
    <div className="login">
    {error && <p>Invalid Credential</p>} 
    <div className="login-container">
       {loading ? <Loading/>: <>
      <div className="profile">
            <img src={log1} alt="" />
        </div>
        <h2>Login</h2>
        <div className="detail">
    <form className='login-form' onSubmit={handleSubmit}>
    <div className="form-group">
             <span><MailOutlineTwoToneIcon/></span>
             <input type="email" placeholder='your email' value={email} onChange={(e) => setEmail(e.target.value)} />
         </div>
             <div className="form-group">
             <span><HttpsTwoToneIcon/></span>
             <input type="password" placeholder='your password' value={password} onChange={(e) => setPassword(e.target.value)}/>
             </div>
             <button type='submit' className='login-btn'>login</button>

    </form>
  <div className='account'>
 <span><Link to="/"> No account?Register</Link></span>
 <span><Link to="/"><strong style={{color:'black'}}>Forgot Password?</strong>Click here</Link></span>
  </div>
  </div>
      </>}
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}

export default Login
