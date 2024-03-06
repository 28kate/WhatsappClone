import { View, Text,StyleSheet, TextInput,Image, FlatList } from 'react-native'
import React from 'react'
import {AntDesign,MaterialIcons} from '@expo/vector-icons'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API,Auth,graphqlOperation,Storage} from 'aws-amplify'
import { createMessage,updateChatRoom,createAttachment} from '../../graphql/mutations'
import * as ImagePicker from 'expo-image-picker'
import 'react-native-get-random-values'
import {v4 as uuidv4} from 'uuid'

const InputBox = ({chatRoom}) => {
  const [text,setText]=useState('');
  const [files,setFiles]=useState([])

  const onSend = async () => {
   

      const authUser = await Auth.currentAuthenticatedUser();
      
      const newMessage={chatroomID:chatRoom.id, text:text, userID: authUser.attributes.sub}


      const newMessageData=await API.graphql(graphqlOperation(
        createMessage,{input:newMessage}
      ))

      setText("")

      await Promise.all(files.map((file)=>addAttachment(file,newMessageData.data.createMessage.id)))
      setFiles([])
    await API.graphql(graphqlOperation(updateChatRoom,{input:{_version: chatRoom._version, chatRoomLastMessageId: newMessageData.data.createMessage.id, id: chatRoom.id}}))
  };




  const addAttachment= async(file,messageID)=>{
    const types={
      'image':'IMAGE',
      'video':'VIDEO',
    }
    const newAttachment={
      storageKey: await uploadFile(file.uri),
      type:types[file.type],
      width:file.width,
      height:file.height,
      duration:file.duration,
      messageID,
      chatroomID:chatRoom.id,

    }

    return API.graphql(graphqlOperation(createAttachment,{input:newAttachment}))
  }
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      if (result.assets.length > 0) {
        setFiles(result.assets);
      } else {
        setFiles([result]);
      }
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const key = `${uuidv4()}.png`; 
      const response = await fetch(fileUri);
      const blob=await response.blob();
      await Storage.put(key, blob, {
        contentType: 'image/png',
      });
      return key;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  };
  return (
    <>
    {files.length > 0 && (
      <View style={styles.attachmentsContainer}>
        <FlatList
        horizontal
        data={files}
        renderItem={({item})=>(
          <>
        <Image source={{uri:item.uri}} style={styles.selectedImage} resizeMode='contain'/>
        <MaterialIcons
        name='highlight-remove'
        onPress={()=>setFiles((existingFiles)=>existingFiles.filter(file=>file != item))}
        size={28}
        color='gray'
        style={styles.removeSelectedImage}
        />
          </>
        )}
         />
       
      </View>
    )}
    <SafeAreaView  edges={['bottom']} style={styles.container}>
 
      <AntDesign onPress={pickImage} name='plus' size={24} color='royalblue'/>

      <TextInput style={styles.input} value={text} onChangeText={setText} placeholder='Type your message...'/>
      <MaterialIcons onPress={onSend} style={styles.send} name='send' size={16} color='white'/>
    </SafeAreaView>
    </>
  )
}

const styles=StyleSheet.create({
container:{
  flexDirection:'row',
  backgroundColor:'whitesmoke',
  padding:5,
  paddingHorizontal:10,
  alignItems:'center',
},
input:{
  flex:1,
  backgroundColor:'white',
  padding:5,
  borderRadius:50,
  paddingHorizontal:10,
  borderColor:'lightgray',
  marginHorizontal:10,
  borderWidth:StyleSheet.hairlineWidth,

},
send:{
  backgroundColor:'royalblue',
  padding:7,
  borderRadius:15,
  overflow:'hidden',
},
selectedImage:{
  width:100,
  height:100,
  margin:5,
},
attachmentsContainer:{
  alignItems:'flex-end'
},
removeSelectedImage:{
  position:'absolute',
  right:10,
  backgroundColor:'white',
  borderRadius:10,
  overflow:'hidden'
}
})

export default InputBox