import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
import { deleteUserChatRoom } from "../graphql/mutations";
import ContactListItem from "../components/ContactListItem";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const chatroomId = route.params.id;

  const fetchChatRoom = async () => {
    setLoading(true);
    const result = await API.graphql(
      graphqlOperation(getChatRoom, { id: chatroomId })
    );
    setChatRoom(result.data?.getChatRoom);
    setLoading(false);
    
  };

  useEffect(() => {
    fetchChatRoom();

    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatroomId } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomId]);

  const removeChatroomUser= async(chatRoomUser)=>{
      const response=await API.graphql(graphqlOperation(deleteUserChatRoom,{input:{_version:chatRoomUser._version,id: chatRoomUser.id}}));
      console.log(response);
      
      
  }

  const onContactPress=(chatRoomUser)=>{
    Alert.alert('Remove User',`Are you sure you want to ${chatRoomUser.name
    } from this group?`,[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>removeChatroomUser(chatRoomUser)}])
    
  }

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  const users = chatRoom.users.items.filter((item) => !item._deleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionTitle}>{users.length} Participants</Text>

        <Text
          onPress={() => navigation.navigate("AddContacts", { chatRoom })}
          style={{ fontWeigh: "bold", color: "#4169e1" }}
        >
          Invite friends
        </Text>
      </View>
      <View style={styles.section}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={()=>onContactPress(item.user)}
        
            />
          )}
      
          
          refreshing={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      updatedAt
      name
      users {
        items {
          id
          chatRoomId
          userId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
      createdAt
      _version
      _deleted
      _lastChangedAt
      chatRoomLastMessageId
    }
  }
`;

export default ChatRoomInfo;