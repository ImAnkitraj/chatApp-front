import axios from 'axios';
import React, { Suspense, useEffect, useState } from 'react';
import './Home.css';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ENDPOINT } from '../../constants';
import TelegramIcon from '@material-ui/icons/Telegram'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ChatImage from '../../ChatImage';
import { useHistory } from 'react-router';
import Loading from '../Loading/Loading';
import LinearProgress from '@material-ui/core/LinearProgress';
const FriendList = React.lazy(()=>import('./FriendList'));


const socket = io(ENDPOINT)

function Home() {

    const userId = localStorage.getItem('userId');
    const history = useHistory();
    const [searchFriends, setSearchFriends] = useState([])
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const [friends, setFriends] = useState([])
    const [friend, setFriend] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState();
    const [isSendingMessage, setIsSendingMessage] = useState()

    useEffect(()=>{
        axios.get(`${ENDPOINT}/get_friends/${localStorage.getItem('userId')}`)
        .then((res)=>{
            console.log(res.data.friends)
            setFriends(res.data.friends)
            setIsLoading(false);
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
        if(searchText.trim() === '')
            setSearchFriends([])
    },[searchText])
    useEffect(()=>{
        setIsLoadingMessages(true);
        axios.get(`${ENDPOINT}/get_room/${roomId}`)
        .then((res)=>{
            console.log('room',res?.data?.room)
            const m = res?.data?.room?.messages.map(m=>{
                return {message:m.message, user:m.user}
            })
            setIsLoadingMessages(false);
            console.log('messages', m)
            setMessages([...m])
            socket.emit('join',{roomId:roomId},()=>{});
        })
        .catch((err)=>{
            console.log(err)
        })
    },[roomId])

    useEffect(()=>{
        socket.on('message',(message)=>{
            console.log('new message',message)
            setMessages([...messages, message])
        });
    },[messages])

    //function to send message
    const sendMessage = (e) => {
        e.preventDefault();
        if(message){
            setIsSendingMessage(true);
            socket.emit('sendMessage', {message:message, userId: userId,roomId: roomId},()=>{setMessage(''); setIsSendingMessage(false)})
        }
    }

    const logout = () =>{
        localStorage.clear();
        history.push('/')
    }
    const search = (e) =>{
        e.preventDefault();
        if(searchText.trim() === ''){
            return;
        }
        axios.post(`${ENDPOINT}/search`,{searchText})
        .then((res)=>{
            console.log('search',res.data)
            setSearchFriends(res.data)
        })
    }
    return isLoading ? <Loading/> : (
        <div className='home-container'>
            <div className='home-body'>
                <div className='home-body-left'>
                    <div className='home-header-left'>
                        <h2>AI Chat</h2>
                        <ExitToAppIcon onClick={logout} style={{cursor:'pointer'}}/>
                    </div>
                    <div className='home-search'>
                        <input 
                            className='search'
                            type="text" 
                            value={searchText}
                            onChange={e=>setSearchText(e.target.value)}
                            onKeyPress={event => event.key === 'Enter' ? search(event) : null}
                            placeholder="Search friends"
                        />
                        <button className="search-button" onClick={e => search(e)}><SearchOutlinedIcon style={{background:'lightyellow'}}/></button>
                    </div>
                    <Suspense fallback={<Loading/>}>
                        <FriendList setFriend={setFriend} setFriends={setFriends} searchFriends = {searchFriends} roomId={roomId} friends={friends} setRoomId={setRoomId}/>
                    </Suspense>
                </div>
                <div className='home-body-right'>

                    {
                        roomId ? (
                            isLoadingMessages ? <Loading/>:
                            <>
                            <div className='home-header-right'>
                                <h3>{friend ? friend.username.toUpperCase() : <>Chat</>}</h3>
                            </div>
                            {isSendingMessage && <LinearProgress/>}
                            <div className='home-chat'>
                                <ScrollToBottom>
                                {
                                    messages?.map((msg,i)=>{
                                        return (
                                            msg.user.toString() === localStorage.getItem('userId').toString() ? (
                                                <div className="message-container justifyEnd" key={i}>
                                                    <p className="message user">{msg.message}</p>
                                                </div>
                                            ):(
                                                <div className="message-container justifyStart" key={i}>
                                                    <p className="message friend">{msg.message}</p>
                                                </div>
                                            )
                                        
                                        )
                                    })
                                }
                                </ScrollToBottom>
                            </div>
                            <div className='home-input-container'>
                                <input type='text' 
                                    className='home-input'
                                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                    placeholder='type here ... ' 
                                    value={message} 
                                    onChange={e=>setMessage(e.target.value)}
                                />
                                <button className="home-input-button" onClick={e => sendMessage(e)}><TelegramIcon/> </button>
                            </div>
                            </>
                        ):(
                            <div className='chat-image'>
                                <ChatImage/>
                            </div>
                        )
                    }
                </div>
                    
            </div>
        </div>
    )
}

export default Home
