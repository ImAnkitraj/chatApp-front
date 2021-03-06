import React,{useEffect, useState} from 'react'
import './Join.css'
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import { ENDPOINT } from '../../constants';
import Loading from '../Loading/Loading'
import swal from 'sweetalert';
import CircularProgress from '@material-ui/core/CircularProgress';

function Join() {

    const history = useHistory();
    const [password ,setPassword] = useState('');
    const [username ,setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [isLogging, setIsLogging] = useState(false);

    const login = (e) => {
      setIsLogging(true);
      e.preventDefault();
      axios.post(`${ENDPOINT}/login`,{
        username,
        password
      })
      .then((res)=>{
        console.log('login',res.data);
        if(res.data.status){
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('username', res.data.user.username);
          localStorage.setItem('friends',JSON.stringify(res.data.user.friends))
          setIsLogging(false);
          history.push('/home');
        }
        else{
          setMessage(res.data.message);
          setIsLogging(false);
          swal(res.data.message);
          // alert(res.data.message);
        }
      })
      .catch(err => {
        console.log('error',err);
      })

    }

    const signup = (e) => {
      setIsLogging(true);
      e.preventDefault();
      axios.post(`${ENDPOINT}/register`,{
        username,
        password
      })
      .then((res)=>{
        console.log('login',res.data);
        if(res.data.status){
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('username', res.data.user.username);
          localStorage.setItem('friends',JSON.stringify([]))

          setIsLogging(false);
          history.push('/home');
        }
        else{
          setMessage(res.data.message);
          setIsLogging(false);
          swal(res.data.message);
          // alert(res.data.message);
        }
      })
      .catch(err => {
        console.log('error',err);
      })
    }

    useEffect(() => {
      setIsLoading(false);
    }, [])

    return isLoading ? <Loading/> : (
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
              {
                isLogin ? (
                  <>
                    <h1 className='heading'>Login</h1>
                    <div><input placeholder="Username" className="joinInput" type="text" onChange={e=>setUsername(e.target.value)}/></div>
                    <div><input placeholder="Password" className="joinInput mt-20" type="password" onChange={e=>setPassword(e.target.value)}/></div>
                    {
                      isLogging ? (
                        <button 
                          onKeyPress={event => event.key === 'Enter' ? ()=>login() : null}
                          className='button mt-20' onClick={login} type='submit'><span><CircularProgress /></span>Login In</button>
                      ):(
                        <button   
                          onKeyPress={event => event.key === 'Enter' ? ()=>login() : null}
                          className='button mt-20' onClick={login} type='submit'>Login In</button>
                      )
                    }
                    
                    <p className='switch' onClick={()=>setIsLogin(false)}>Switch to Sign Up</p>
                  </>
                ):(
                  <>
                    <h1 className='heading'>Sign Up</h1>
                    <div><input placeholder="Username" className="joinInput" type="text" onChange={e=>setUsername(e.target.value)}/></div>
                    <div><input placeholder="Password" className="joinInput mt-20" type="password" onChange={e=>setPassword(e.target.value)}/></div>
                    {
                      isLogging ? (
                        <button 
                        onKeyPress={event => event.key === 'Enter' ? ()=>signup() : null}
                        className='button mt-20' onClick={signup} type='submit'><span><CircularProgress/></span>Sign Up</button>
                      ):(
                        <button 
                        onKeyPress={event => event.key === 'Enter' ? ()=>signup() : null}
                        className='button mt-20' onClick={signup} type='submit'>Sign Up</button>
                      )
                    }
                    
                    <p className='switch' onClick={()=>setIsLogin(true)}>Switch to Log in</p>
                  </>
                )
              }
            </div>
        </div>
    )
}

export default Join
