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
import DateTimePicker from 'react-native-modal-datetime-picker';
const FormPage = () => {
  const [destination, setDestination] = useState('');
  const [route, setRouteNo] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('Enter Departure Time');
  const [show, setShow] = useState('Enter time');
  const [date,setdate] = useState('Enter Date');
  const [drivername,setdrivername] = useState('');
  const [drivercontact,setdrivercontact] = useState('');
  const handleSubmit = async () => {
    try {
      const docRef = await setDoc(doc(database, 'Buses',destination), {
        date:date,
        routeid:route,
        price:price,
        time:time,
        drivername:drivername,
        drivernumber:drivercontact,
      });
      // reset the form inputs
      setDestination('');
      setRouteNo('');
      setPrice('');
      setTime('Enter Departure Time');
      setdrivercontact('');
      setdrivername('');
      Alert.alert('Success', 'Bus added successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker1 = () => {
    setTimePickerVisibility(false);
  };
  const handleConfirm = (date) => {
   // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
    var Date = date.getDate()
    var year = date.getFullYear()
    var month = date.getMonth();
    var format = Date+"-" +month+"-"+year;
     setdate(format);
    hideDatePicker();
  };
  const handleConfirm1 = (time) => {
    var hrs = time.getHours()
    var min = time.getMinutes()
    var out = hrs + ":" + min 
    setTime(out);
    hideTimePicker1();
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
          placeholder="Enter Driver name"
          autoCapitalize="none"
          autoCorrect={false}
          value={drivername}
          onChangeText={setdrivername}
        />
         <TextInput
          style={styles.input}
          placeholder="Enter Driver number"
          autoCapitalize="none"
          keyboardType="numeric"
          maxLength={10}
          autoCorrect={false}
          value={drivercontact}
          onChangeText={setdrivercontact}
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
      <TouchableOpacity onPress={showDatePicker} style={styles.input} >
        <Text style={{marginTop:'4%',color:'#a9a9a9'}}>{date.toString()}</Text>
        <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        /> 
      </TouchableOpacity>
      <TouchableOpacity onPress={showTimePicker} style={styles.input} >
        <Text style={{marginTop:'4%',color:'#a9a9a9'}}>{time.toString()}</Text>
        <DateTimePicker
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm1}
        onCancel={hideTimePicker1}
        /> 
      </TouchableOpacity>
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
    flex:1, 
    justifyContent :"center",
  },
  subcontainer: {
    height: 500,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth:1,
   borderColor:colors.primary, 
   width:"90%", 
   height:50,  
   borderRadius:10,
   paddingHorizontal: 20,
  },
});
