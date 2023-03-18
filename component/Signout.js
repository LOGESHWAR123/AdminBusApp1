// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity,Alert} from 'react-native';
// import { FontAwesome } from '@expo/vector-icons'; // assuming you have FontAwesome installed
// import { getAuth, signOut } from "firebase/auth";
// const UserIcon = () => {
//   return (
//     <View style={styles.userIconContainer}>
//       <FontAwesome name="user" size={32} color="#fff" />
//     </View>
//   );
// };

// const LogoutButton = ({ onPress }) => {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.logoutButton}>
//       <Text style={styles.logoutButtonText}>Logout</Text>
//     </TouchableOpacity>
//   );
// };

// const Signout = () => {
//     const handleLogout = async() => {
//         const auth = getAuth();
//             signOut(auth).then(() => {
//             Alert.alert('Logged out successfully');
//         }).catch((error) => {
//             console.log(error);
//         });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <UserIcon />
//       </View>
//       <Text style={styles.adminText}>Admin</Text>
//       <LogoutButton onPress={handleLogout} />
//     </View>
//   );
// };
// export default Signout
// const styles = StyleSheet.create({
//   container: {
//     marginTop:'20%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   userIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#ccc',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },
//   adminText: {
//     fontWeight: 'bold',
//     marginBottom:20,
//     marginRight:10,
//   },
//   logoutButton: {
//     backgroundColor: '#1C64D1',
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });


import React, { Component,useLayoutEffect, useState,useEffect } from 'react';
import {StyleSheet,Text,View,Image,Button,TouchableOpacity,TextInput, BackHandler} from 'react-native';
import { getAuth} from "firebase/auth";
import colors from '../colors';
import { auth, database} from '../config/firebase'; 
import { signOut } from 'firebase/auth';
import {collection,addDoc,orderBy,query,onSnapshot,getDocs,docRef,getDoc,doc,where} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Userprofile = () =>  {
  const navigation=useNavigation();
  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
    //navigation.popToTop()

  };

//const currentMail = getAuth()?.currentUser.email;
const currentMail="adminbus@sairamtap.edu.in"
   {
    return (
      <View style={styles.container}>
  

    <View style={styles.body}>


      <View style={styles.bluebox}>

        <View style={{justifyContent:"flex-end",width:"40%",alignItems:"center"}}>
        <Image
              style={styles.avatar}
              source={{
                uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
              }}
        />
          
        </View>

        <View style={{width:"50%",justifyContent:"center"}}>
              <Text style={{color:"white",fontSize:20,marginLeft:10,marginBottom:2,fontWeight:"bold"}}>AdminBus app</Text>
              <Text style={{color:"white",fontSize:12,marginLeft:10,marginBottom:2}} >adminbus@sairamtap.edu.in</Text>
        </View>

      </View>

        <View style={{ width: "100%",height:100,marginTop:20,margin:10}}>
    <TouchableOpacity onPress={onSignOut}>
      <View
        style={{
          backgroundColor: colors.primary,
          width: 120,
          height: 40,
          borderRadius:15,
          justifyContent: "center",
          alignItems:"center",
          flexDirection:"row",
          marginTop:40,
          marginLeft:"30%",
        }}
      >
        {/* <FontAwesome name="sign-out" size={22} color={"white"} style={{marginRight:10,justifyContent:"center"}}/> */}
        <Text style={{ color: "white", fontSize: 13, justifyContent:"center",alignItems:"center",}}>LogOut</Text>
      </View>
      <Text style={{color: "#5e5e5e" ,fontSize:13,marginTop:5,textAlign:"center"}}>Do you want to Signout?</Text>
    </TouchableOpacity>

        </View>
        </View>
      </View>
    );
  }
}
export default Userprofile;
const styles = StyleSheet.create({

  container:{
    flex:1
  },
  bluebox:{
    height:"30%",
    backgroundColor:colors.primary,
    flexDirection:"row", 
    alignItems:"center",
    justifyContent:"center"
  },
  header:{
    backgroundColor: 'white',
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
    backgroundColor:colors.primary
  },
  body:{
    backgroundColor: "#fff",
    height:"100%",
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  logout:{
   backgroundColor: "#fff",
   width: 100 ,
   height: 50,
   alignItems: "center",
   justifyContent: "center",
   marginTop: 60, 
   backgroundColor: colors.primary, 
   borderColor: "black",
   borderRadius: 10,
}, 
avatar: {
  width: 80,
  height: 80,
  borderRadius: 63,
  borderWidth: 1,
  borderColor: "white",
  marginBottom:10,

},

});