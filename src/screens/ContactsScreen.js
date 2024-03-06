import { View, Text ,FlatList, Pressable} from 'react-native'
import React,{useState,useEffect} from 'react'
import ContactListItem from '../components/ContactListItem'
import { listUsers } from '../graphql/queries'
import {MaterialIcons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { createChatRoom,createUserChatRoom } from '../graphql/mutations';
import {getCommonChatRoom} from '../services/chatRoomService'
import { API,graphqlOperation,Auth} from 'aws-amplify';


const ContactsScreen = () => {
  const [users,setUsers]=useState([])
  const navigation=useNavigation();
  const [selectedUseris,setSelectedUserids]=useState([]);

  useEffect(()=>{
    API.graphql(graphqlOperation(listUsers)).then((result)=>{
      setUsers(result.data?.listUsers?.items);
    })
  },[])

  const createPrivateChatRoomWithUser=async(user)=>{
    const existingChatRoom=await getCommonChatRoom(user.id)
    if(existingChatRoom){
      navigation.navigate('OneChat',{id:existingChatRoom.chatRoom.id})
      return;
    }

     const newChatRoomData=await API.graphql(graphqlOperation(createChatRoom,{input:{}}))
     console.log(newChatRoomData);
    if(!newChatRoomData.data?.createChatRoom){
      console.log("Error creating chatroom")
    }
    const newChatRoom=newChatRoomData.data?.createChatRoom;

    await API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId:newChatRoom.id,userId:user.id}}))
    

    const authUser= await Auth.currentAuthenticatedUser();
    await API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId:newChatRoom.id,userId:authUser.attributes.sub}}))
  
  navigation.navigate('OneChat',{id:newChatRoom.id})
  
  }


  return (
    <FlatList
   data={users}
  
   ListHeaderComponent={()=>(
    <Pressable onPress={()=>{navigation.navigate('NewGroup')}}
    style={{flexDirection:'row',alignItems:'center',padding:15,paddingHorizontal:20,}}
    >
      <MaterialIcons
      name='group'
      size={24}
      color='#4169e1'
      style={{marginRight:20,backgroundColor:'gainsboro',padding:7,borderRadius:20,overflow:'hidden'}}
      />
      <Text style={{color:'#4169e1',fontSize:16}}>New Group</Text>
      
    </Pressable>
   )}
   renderItem={({item})=>{
    return(
     <ContactListItem user={item} onPress={()=>createPrivateChatRoomWithUser(item)}/>
    )
   }}
   /> 
  )
}

export default ContactsScreen