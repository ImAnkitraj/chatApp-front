import React,{useState} from 'react'
import './Join.css'
import axios from 'axios';
import {useHistory} from 'react-router-dom'
function Join() {

    const history = useHistory();
    const [password ,setPassword] = useState('');
    const [username ,setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [, setMessage] = useState('')

    const login = (e) => {
      e.preventDefault();
      axios.post("http://localhost:5000/login",{
        username,
        password
      })
      .then((res)=>{
        console.log('login',res.data);
        localStorage.clear()

        if(res.data.status){
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('username', res.data.user.username);
          history.push('/home');
        }
        else{
          setMessage(res.data.message);
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.log('error',err);
      })

    }

    const signup = (e) => {
      e.preventDefault();
      axios.post("http://localhost:5000/register",{
        username,
        password
      })
      .then((res)=>{
        console.log('login',res.data);
        localStorage.clear()
        if(res.data.status){
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('username', res.data.user.username);
          history.push('/home');
        }
        else{
          setMessage(res.data.message);
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.log('error',err);
      })
    }

    return (
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
              {
                isLogin ? (
                  <>
                    <h1 className='heading'>Login</h1>
                    <div><input placeholder="Username" className="joinInput" type="text" onChange={e=>setUsername(e.target.value)}/></div>
                    <div><input placeholder="Password" className="joinInput mt-20" type="password" onChange={e=>setPassword(e.target.value)}/></div>
                    <button className='button mt-20' onClick={login} type='submit'>Login In</button>
                    <p style={{color:"white",cursor:"pointer"}}onClick={()=>setIsLogin(false)}>Switch to Sign Up</p>
                  </>
                ):(
                  <>
                    <h1 className='heading'>Sign Up</h1>
                    <div><input placeholder="Username" className="joinInput" type="text" onChange={e=>setUsername(e.target.value)}/></div>
                    <div><input placeholder="Password" className="joinInput mt-20" type="password" onChange={e=>setPassword(e.target.value)}/></div>
                    <button className='button mt-20' onClick={signup} type='submit'>Sign Up</button>
                    <p style={{color:"white", cursor:"pointer"}} onClick={()=>setIsLogin(true)}>Switch to Log in</p>
                  </>
                )
              }
            </div>
        </div>
    )
}

export default Join
