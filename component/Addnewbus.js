import React, { Component,useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert,  } from "react-native";
import { getAuth} from "firebase/auth";
import colors from '../colors';
import { Dimensions } from "react-native";
import { auth, database} from '../config/firebase'; 
import {  fetchSignInMethodsForEmail } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import {collection,addDoc,orderBy,query,onSnapshot,getDocs,docRef,getDoc,setDoc,doc,QuerySnapshot,collectionGroup,getCountFromServer} from 'firebase/firestore';
//import { TouchableOpacity } from 'react-native-gesture-handler';
const FormPage = () => {
  const [destination, setDestination] = useState('');
  const [route, setRouteNo] = useState('');
  const [price, setPrice] = useState('');
  const [time, settime] = useState('');

  const handleSubmit = async () => {
    try {
      const docRef = await setDoc(doc(database, 'Buses',destination), {
        route:parseInt(route,10),
        price:parseInt(price,10),
        time:time,
      });
      // reset the form inputs
      setDestination('');
      setRouteNo('');
      setPrice('');
      settime('');
      Alert.alert('Success', 'Bus added successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Enter your Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          autoCapitalize="none"
          autoCorrect={false}
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Route-no"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          value={route}
          onChangeText={setRouteNo}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Price"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Destination Time"

          autoCapitalize="none"
          autoCorrect={false}
          value={time}
          onChangeText={settime}
        />
      </View>
      <TouchableOpacity style={{justifyContent:"center",alignItems:"center",bottom:30}}  onPress={handleSubmit}>
       <View style={{height:60,width:150,backgroundColor:colors.primary,borderRadius:6,justifyContent:"center",alignItems:"center",marginTop:50}}>
        <Text style={{fontSize:15,color:"white",fontWeight:"bold"}}>Submit</Text>
       </View>
      </TouchableOpacity>
    </View>
  );
};

export default FormPage;

const styles = StyleSheet.create({
  container: {
    paddingTop:40,
    flex:1, 
    justifyContent :"center"
  },
  subcontainer: {
    height: 350,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    color: 'black',
  },
  input: {
    borderWidth:1,
   borderColor:colors.primary, 
   width:"90%", 
   height:50,  
   borderRadius:5,
   paddingHorizontal: 20,
  },
});
