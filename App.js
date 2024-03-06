import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigation';
import {Amplify,Auth,API,graphqlOperation} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsmobile from './src/aws-exports'
import { useEffect } from 'react';
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

Amplify.configure({...awsmobile,Analytics:{disabled:true}});

function App() {

  useEffect(()=>{
    const syncUser=async()=>{
      try {
        const authUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
        const UserData = await API.graphql(graphqlOperation(getUser, { id: authUser.attributes.sub }));
      
        if (UserData.data.getUser) {
          console.log('User data:', UserData.data.getUser);
        } else {
                
       const newUser={
        id:authUser.attributes.sub,
        name:authUser.attributes.phone_number,
        image:'',
        status:'Available'
       };

       const newUserResponse= await API.graphql(graphqlOperation(createUser,{input:newUser}))
        }
      } catch (error) {
        console.error('GraphQL Error:', error);
      }
      

    }; 

  
    syncUser();
  },[])


  return (
    <View style={styles.container}>
      <Navigation/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  
  },
});


export default withAuthenticator(App);