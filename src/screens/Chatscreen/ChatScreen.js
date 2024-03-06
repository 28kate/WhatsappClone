import { View, Text,FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import chats from '../../../assets/data/chats.json'
import ChatListItem from '../../components/ChatListItem'
import { API,graphqlOperation,Auth } from 'aws-amplify'
import { listChatRooms } from '../Chatscreen/queries'

const ChatScreen = () => {
  const [chatRoom,setChatRoom]=useState([])
  const [loading,setLoading]=useState(false)
  const fetchChatRooms=async()=>{
    setLoading(true);
    const authUser=await Auth.currentAuthenticatedUser();
    const response=await API.graphql(graphqlOperation(listChatRooms,{id:authUser.attributes.sub}))
    
    const rooms=response?.data?.getUser?.ChatRooms?.items || [];
    const sortedRooms=rooms.sort((r1,r2)=>
       new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt)
    )
    setChatRoom(sortedRooms);
    setLoading(false)
  
  }

  useEffect(()=>{
    fetchChatRooms();
  },[])
  return (
   <FlatList
   data={chatRoom}
   keyExtractor={(item) => item.id}
   refreshing={loading}
   onRefresh={fetchChatRooms}
   renderItem={({item})=>{
    return(
     <ChatListItem chat={item.chatRoom}/>
    )
   }}
   /> 
  )
}

export default ChatScreen