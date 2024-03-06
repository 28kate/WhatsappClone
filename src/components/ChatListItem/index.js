import React, { useEffect, useState } from 'react';
import { View, Text, Image,StyleSheet ,Pressable} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);
import { useNavigation } from '@react-navigation/native';
import OneChat from '../../screens/OneChat/OneChat';
import { API, graphqlOperation ,Auth} from 'aws-amplify';
import {onUpdateChatRoom} from '../../graphql/subscriptions';

const ChatListItem = ({chat}) => {
  
  const navigation=useNavigation();
  const [user,setUser]=useState(null);
  const [ChatRoom,setChatRoom]=useState(chat)
  useEffect(()=>{
      const fetchUser= async ()=>{
        const authUser= await Auth.currentAuthenticatedUser()
        const userItem =ChatRoom.users.items.find(item=>item.user.id != authUser.attributes.sub)
        setUser(userItem?.user)
      }
      fetchUser();
  },[])

  useEffect(()=>{
       const subscription=API.graphql(graphqlOperation(onUpdateChatRoom,{filter:{id:{eq:chat.id}}})).subscribe({
         next:({value})=>{
           console.log(value);
           setChatRoom(cr =>({...(cr||{}), ...value.data.onUpdateChatRoom}))
         },
         error:(err)=> console.log(err)
       })

    return ()=> subscription.unsubscribe();
 },[chat.id])

  
  return (
    <Pressable onPress={()=>{navigation.navigate('OneChat',{id:ChatRoom.id,name:user?.name})}} style={styles.container}>
      <Image
        source={{
          uri: user?.image,
        }}
        style={styles.image}
      /> 
      <View style={styles.content}>
        <View style={styles.row}>
        <Text numberOfLines={1} style={styles.name}>{ChatRoom.name || user?.name}</Text>
            {ChatRoom.LastMessage && (<>   
            <Text style={styles.subTitle}>{dayjs(ChatRoom.LastMessage?.createdAt).fromNow(true)}</Text></>
            )}
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>{ChatRoom.LastMessage?.text}</Text>
      </View>
    </Pressable>
  );
};

const styles=StyleSheet.create({
container:{
flexDirection:'row',
marginHorizontal:10,
marginVertical:5,
height:70,
},    
image:{
    width:60,
    height:60,
    borderRadius:30,
    marginRight:10,
},
content:{
    flex:1,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'lightgray',
},
row:{
    flexDirection:'row',
},
name:{
    flex:1,
    fontWeight:'bold',
    marginBottom:5,
},
subTitle:{
    color:'gray',
}
})

export default ChatListItem;
