import { View, Text,Pressable,Image,StyleSheet } from 'react-native'
import {useState} from 'react'
import ImageView from 'react-native-image-viewing';

const ImageAttachment = ({attachments}) => {
    const [ImageViewer,setImageViewer]=useState(false)
  return (
    <>
    {attachments.map((attachment)=>(
    <Pressable 
    key={attachment.id}
    style={[styles.imageContainer,attachments.length===1 && {flex:1,
        
    }]} onPress={()=>setImageViewer(true)}>
    <Image source={{uri:attachment.uri}} style={styles.image}/>
    </Pressable>
    ))}
    
    <ImageView images={attachments.map(({uri})=>({uri}))} imageIndex={0} visible={ImageViewer} onRequestClose={()=>setImageViewer(false)}/>
    </>

  )
}

const styles = StyleSheet.create({
    
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
  
  

export default ImageAttachment
