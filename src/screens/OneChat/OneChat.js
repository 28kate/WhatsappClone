import { View, Text ,ImageBackground,StyleSheet,FlatList, KeyboardAvoidingView, Platform, ActivityIndicator} from 'react-native'
import React,{useEffect, useState} from 'react'
import { useRoute,useNavigation } from '@react-navigation/native'
import bg from '../../../assets/images/BG.png'
import Message from '../../components/Message'
import InputBox from '../../components/InputBox'
import { API,graphqlOperation } from 'aws-amplify'
import {getChatRoom} from '../../graphql/queries'
import { listMessagesByChatRoom } from './OneChatScreenQueries'
import {onCreateAttachment, onCreateMessage} from '../../graphql/subscriptions'
import {Feather} from '@expo/vector-icons'

const OneChat = () => { 
  const [chatRoom,setChatRoom]=useState(null)
  const route=useRoute();
  const navigation=useNavigation();
  const chatRoomId=route.params.id;
  const [messages,setMessages]=useState([]);

  useEffect(()=>{
     API.graphql(graphqlOperation(getChatRoom,{id:chatRoomId})).then((result)=>{
        setChatRoom(result.data?.getChatRoom)
      })
    //     const subscription=API.graphql(graphqlOperation(onUpdateChatRoom,{filter:{id:{"eq":chatRoomId}}})).subscribe({
    //       next:({value})=>{
    //         console.log(value);
    //         setChatRoom(cr =>({...(cr||{}), ...value.data.onUpdateChatRoom}))
    //       },
    //       error:(err)=> console.log(err)
    //     })

    //  return ()=> subscription.unsubscribe();
  },[chatRoomId])

 
  useEffect(()=>{
    API.graphql(graphqlOperation(listMessagesByChatRoom,{chatroomID: chatRoomId, sortDirection: "DESC"})).then((result)=>{
      setMessages(result.data?.listMessagesByChatRoom?.items)
    })
    const subscription=API.graphql(graphqlOperation(onCreateMessage,{filter:{chatroomID:{"eq":chatRoomId}}})).subscribe({
      next:({value})=>{
       console.log("newMessage")
       console.log(value)
       setMessages(m=>[value.data.onCreateMessage,...m])
      },
      error :(err)=> console.log(err) 
    })


    const subscriptionAttachments=API.graphql(graphqlOperation(onCreateAttachment,{filter:{chatroomID:{"eq":chatRoomId}}})).subscribe({
      next:({value})=>{
       const newAttachment=value.data.onCreateAttachment;
       setMessages(existingMessages=>{
         const messageToUpdate=existingMessages.find((em=>em.id===newAttachment.messageID))
         if(!messageToUpdate){
          return existingMessages
         }
         if(!messageToUpdate?.Attachments?.items){
          messageToUpdate.Attachments.items=[];
         }
         messageToUpdate.Attachments.items.push(newAttachment)
         return existingMessages.map((m)=>m.id===messageToUpdate.id?messageToUpdate:m)
       })
      },
      error :(err)=> console.log(err) 
    })
    return ()=>{
    subscription.unsubscribe()
    subscriptionAttachments.unsubscribe()
  };

  },[chatRoomId])

  useEffect(()=>{
    navigation.setOptions({title:route.params.name,headerRight:()=>(<Feather onPress={()=>{navigation.navigate('GroupInfo',{id:chatRoomId})}}name='more-vertical' size={24} color='gray'/>)})
  },[route.params.name,chatRoomId])   

  if(!chatRoom){
    return <ActivityIndicator/>
  }
 
  console.log(JSON.stringify(messages,null,2))
 
  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={Platform.OS ==='ios' ? 60: 90}
    behavior={Platform.OS ==='ios' ? 'padding': 'height'}
    style={styles.bg}
    >
   <ImageBackground source={bg}
   style={styles.bg}
   >
     <FlatList
     data={messages}
     style={styles.list}
     inverted
     renderItem={({item})=>{
        return(
          <Message message={item}
          />
        )
     }}
     />
     <InputBox chatRoom={chatRoom}/>
   </ImageBackground>
   </KeyboardAvoidingView>
  )
} 

const styles=StyleSheet.create({
  bg:{
    flex:1,
  },
  list:{
    padding:10,
    
  }
})

export default OneChat