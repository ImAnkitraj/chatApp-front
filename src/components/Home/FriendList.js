import React ,{useState, useEffect}from 'react'
import axios from 'axios';
import { ENDPOINT } from '../../constants';
import AddIcon from '@material-ui/icons/Add'

function FriendList({setRoomId,setFriend,friends, setFriends,searchFriends, roomId}) {
    let f = []
    const friendLocal  = JSON.parse(localStorage.getItem('friends'))
    friendLocal?.map(_=> {
        f.push(_.friendId)
        return _
    });
    
    const openChat = (friend) =>{
        setFriend(friend)
        friend?.friends.map((_)=>{
            if(_.friendId.toString() === localStorage.getItem('userId').toString()){
                setRoomId(_.roomId.toString())
                console.log(roomId)
            }
            return _
        })
    }

    const addFriend = (friend) => {
        console.log('add', friend)
        axios.post(`${ENDPOINT}/add_friend`,{
            userId: localStorage.getItem('userId'),
            friendId: friend._id
        })
        .then((res)=>{
            console.log('friend added',res.data);
            return axios.get(`${ENDPOINT}/${localStorage.getItem('userId').toString()}`)
        })
        .then((res)=>{
            console.log('user afetr add friends',res.data)
            if(res.data.user[0]._id === friend._id)
                setFriends([...friends, res.data.user[0]])
            else
                setFriends([...friends, res.data.user[1]])

        })
        .catch((err)=>{
            console.log('error in add frined', err)
        })
    }

    return (
        <div className='home-friends'>
            { searchFriends.length > 0 && <h4 className="list-heading">Search Results</h4>}

            {
                searchFriends?.map(_=> {
                    if(_._id === localStorage.getItem('userId')){
                        return <></>;
                    }
                    return  f.includes(_._id) ? 
                    (<p className='single-friend' onClick={()=>openChat(_)} key={_._id}><h3>{_.username}</h3></p>) 
                    : 
                    (<p className='single-friend' onClick={()=>addFriend(_)} key={_._id}><h3>{_.username}</h3><span><AddIcon/></span></p>)
                })
            }
            <h4 className="list-heading" >Friends List</h4>
            {
                friends?.map(friend => {
                    return (<p className='single-friend' onClick={()=>openChat(friend)} key={friend._id}><h3>{friend.username}</h3></p>) 
                })
            }
        </div>
    )
}

export default FriendList
