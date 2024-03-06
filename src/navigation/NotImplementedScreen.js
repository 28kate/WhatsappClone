import { View, Text ,StyleSheet,Image} from 'react-native'
import React from 'react'

const NotImplementedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NotImplementedScreen</Text>
    <Image source={{
        uri:'https://notjustdev-dummy.s3.us.east-2'
    }}/>
    </View>
  )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        fontSize:18,
        color:'gray',
        fontWeight:500
    }
})

export default NotImplementedScreen