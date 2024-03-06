import { View, Text ,FlatList, Pressable, Button, TextInput,StyleSheet} from 'react-native'
import React,{useState,useEffect} from 'react'
import ContactListItem from '../components/ContactListItem'
import { API,graphqlOperation,Auth} from 'aws-amplify'
import { listUsers } from '../graphql/queries'
import { createChatRoom,createUserChatRoom } from '../graphql/mutations';
import { useNavigation } from '@react-navigation/native'


const NewGroupScreen = () => {
  const [users,setUsers]=useState([])
  const [name,setName]=useState('');
  const navigation=useNavigation();
  const [selectedUseris,setSelectedUserids]=useState([]);

  useEffect(()=>{
    API.graphql(graphqlOperation(listUsers)).then((result)=>{
      setUsers(result.data?.listUsers?.items);
    })
  },[])

  useEffect(()=>{
    navigation.setOptions({
      headerRight:()=>(
        <Button title="Create" disabled={!name || selectedUseris.length < 1} onPress={onCreateGroupress}/>
      )
    })
  },[name,selectedUseris])

  const onCreateGroupress=async()=>{
   

     const newChatRoomData=await API.graphql(graphqlOperation(createChatRoom,{input:{name}}))
    if(!newChatRoomData.data?.createChatRoom){
      console.log("Error creating chatroom")
    }
    const newChatRoom=newChatRoomData.data?.createChatRoom;

    await Promise.all(selectedUseris.map(userId => API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId:newChatRoom.id,userId}}))))


    

    const authUser= await Auth.currentAuthenticatedUser();
    await API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId:newChatRoom.id,userId:authUser.attributes.sub}}))
    setSelectedUserids([]);
    setName('');
  
  navigation.navigate('OneChat',{id:newChatRoom.id})
  
  }



  const onContactPress=(id)=>{
     setSelectedUserids((userIds)=>{
      if(userIds.includes(id)){
        return [...userIds].filter((uid)=> uid != id)
 
      }
      else{
        return [...userIds,id]

      }

     })
  }


  return (
   <View style={styles.container}>
    <TextInput
    placeholder="Group Name"
    value={name}
    onChangeText={setName}
    style={styles.input}
    />
    <FlatList
    data={users}
    renderItem={({item})=><ContactListItem user={item} selectable onPress={()=>{onContactPress(item.id)}} isSelected={selectedUseris.includes(item.id)}/>}
    />

   </View>
    
  )
}

const styles=StyleSheet.create({
  container:{backgroundColor:'white'},
  input:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderColor:'lightgray',
    padding:10,
    margin:10
  }

})

export default NewGroupScreen