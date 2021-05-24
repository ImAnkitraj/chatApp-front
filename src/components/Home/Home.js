import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Home.css';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ENDPOINT } from '../../constants';
const socket = io(ENDPOINT)

function Home() {
    const [friends, setFriends] = useState([])
    const [roomId, setRoomId] = useState('')
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('');
    const [searchText, setSearchText] = useState('')

    useEffect(()=>{
        axios.get(`${ENDPOINT}/get_friends/${localStorage.getItem('userId')}`)
        .then((res)=>{
            console.log(res.data.friends)
            setFriends(res.data.friends)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    const openChat = (friend) =>{
        friend.friends.map((_)=>{
            if(_.friendId.toString() === localStorage.getItem('userId').toString()){
                setRoomId(_.roomId.toString())
            }
        })
    }

    useEffect(()=>{
        axios.get(`${ENDPOINT}/get_room/${roomId}`)
        .then((res)=>{
            console.log('room',res?.data?.room)

            const m = res?.data?.room?.messages.map(m=>{
                return {message:m.message, user:m.user}
            })
            console.log('messages', m)
            setMessages(m)
            socket.emit('join',{roomId:roomId},()=>{});
        })
        .catch((err)=>{
            console.log(err)
        })
    },[roomId])

    useEffect(()=>{
        socket.on('message',(message)=>{
            if(messages){
                setMessages([...messages, message])
            }
            else{
                setMessages([message])
            }
        })
    },[messages])

    //function to send message
    const sendMessage = (e) => {
        e.preventDefault();
        if(message){
            let userId = localStorage.getItem('userId');
            socket.emit('sendMessage', {message:message, userId: userId,roomId: roomId},()=>{setMessage('')})
        }
    }

    const search = (e) =>{
        e.preventDefault();
        axios.post(`${ENDPOINT}/search`,{searchText})
    }
    return (
        <div className='home-container'>
            <div className='home-body'>
                <div className='home-body-left'>
                    <div className='home-header'>
                        header
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
                        <button className="search-button" onClick={e => search(e)}>Search</button>
                    </div>
                    <div className='home-friends'>
                        {
                            friends.map(friend => {
                                return <p onClick={()=>openChat(friend)} key={friend._id}>{friend.username}</p>
                            })
                        }
                    </div>
                </div>
                <div className='home-body-right'>
                    <div className='home-header'>
                        header
                    </div>

                    {
                        roomId ? (
                            <>
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
                                <button className="home-input-button" onClick={e => sendMessage(e)}>Send</button>
                            </div>
                            </>
                        ):(
                            <></>
                        )
                    }
                </div>
                    
            </div>
        </div>
    )
}

export default Home
