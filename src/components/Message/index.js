import { View, Text, StyleSheet,Image, Pressable, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react' // Import useEffect
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);
import { Auth,Storage } from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';
import ImageView from 'react-native-image-viewing';
import { Video } from 'expo-av';
import ImageAttachment from './ImageAttachment';
import VideoAttachment from './VideoAttachment';

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [downloadedAttachments,setDownloadedAttachments]=useState([])
  const [ImageViewer,setImageViewer]=useState(false)
  const {width}=useWindowDimensions()

  useEffect(() => {
    const isMyMessage = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setIsMe(message.userID === authUser.attributes.sub);
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      }
    }
    isMyMessage();
  }, []);

  useEffect(()=>{
    const downloadAttachments=async()=>{
      if(message.Attachments?.items?.length >0){
        const downloadedAttachments=await Promise.all(message.Attachments.items.map((attachment)=>
        Storage.get(attachment.storageKey).then((uri)=>({
          ...attachment,
          uri
        }))

        ))
        setDownloadedAttachments(downloadedAttachments)
      }
    }
    downloadAttachments() 

  },[JSON.stringify(message.Attachments?.items)])

  const imageContainerWidth=width *0.8 -30;
  const imageAttachments=downloadedAttachments.filter(at=>at.type==='IMAGE')
  const videoAttachments=downloadedAttachments.filter(at=>at.type==='VIDEO')
  return (
    <View style={[styles.container, {
      backgroundColor: isMe ? '#DCF8C5' : 'white',
      alignSelf: isMe ? 'flex-end' : 'flex-start',
    }]}>
      {downloadedAttachments?.length > 0 && (
  <View style={[{ width: imageContainerWidth }, styles.images]}>
    <ImageAttachment attachments={imageAttachments} />
    <VideoAttachment attachments={videoAttachments} width={imageContainerWidth} />
  </View>
)}

      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  time: {
    color: 'gray',
    alignSelf: 'flex-end'
  }
  ,
  image:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:5,
    flex:1,
  },
  images:{
   flexDirection:'row',
   flexWrap:'wrap',
  },
  imageContainer:{
   padding:3,
   width:'50%',
   aspectRatio:1,
  }
})

export default Message
