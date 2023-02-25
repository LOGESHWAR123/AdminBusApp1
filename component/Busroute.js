import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar, Button, TouchableOpacity} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const height = screenHeight * 0.3;
const width = screenWidth * 0.998;


function Busroute() {
  const navigation=useNavigation();
  const [bookings,setbookings]=useState([]);
  const collectionRef = collection(database, 'previous booking'); 
    useLayoutEffect(() => {

        const q = query(collectionRef,orderBy('SI','desc'),limit(4))
        const unsubscribe = onSnapshot(q, querySnapshot => {
          setbookings(
            querySnapshot.docs.map(doc => 
              (
              {
              Name:doc.data().Name,
              Id:doc.data().Id,
              destination:doc.data().Destination,
              price:doc.data().Price,
            }))
          ),

          console.log(querySnapshot.size);
        });        
      
      return unsubscribe;
      }, 
      
      []); 
      console.log(bookings);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.texting}>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.1,fontSize:20,fontWeight:'bold'}]}>Bookings</Text>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.1,fontSize:20,fontWeight:'bold'}]}>Buses Available</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.16,fontWeight:'bold'}]}>1200</Text>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.27 ,fontWeight:'bold'}]}>20</Text>
        </View>
      </View>
      <View style={styles.booking}>
        <Text style={[styles.text, {alignSelf:'center',fontSize : 14,fontWeight : 'bold'}]}>Total Earnings</Text>
        <Text style={[styles.text , { alignSelf: 'center', fontSize: 15 }]}>20,000</Text>
      </View>
      <View style={styles.prevbook}>
          <Text style={{fontSize:20,fontWeight:'bold'}}>Previous Booking</Text>
        {bookings.map((booking, index) => (
          <View style={styles.bo} key={index}>
            <View style={{flexDirection:'row',justifyContent:"space-between"}}>
              <View >
                 <Text>{booking.Name}</Text>
                <Text>{booking.Id}</Text>
              </View>
              <View style={{flexDirection: 'column', alignItems: 'flex-end',marginHorizontal:'10%'}}>
                <Text>{booking.destination}</Text>
                <Text>{booking.price}</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
    <View style={styles.button} >
      <TouchableOpacity style={styles.viewbook} onPress={()=>navigation.navigate('PreviousBooking')}>
        <Text style={styles.text}>View Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.viewbook , {marginHorizontal:60}]} onPress={()=>navigation.navigate('UpdateBus')} >
        <Text style={styles.text}>Update Bus</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({

  heading: {
    backgroundColor: '#0672CF',
    height: 200,
    width: width,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  texting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  text: {
    fontSize: 17,
    color: 'white',
  },
  
  dateContainer: {
    flexDirection: 'row',
    marginTop: 17,
    justifyContent: 'space-between',
  },
  
  booking: {
  alignSelf: 'center',
  marginTop: '10%',
  backgroundColor: '#0672CF',
  width: '50%',
  height: 50,
},

prevbook: {
  marginTop: '10%',
  marginLeft : '10%',
},

bo:{
  marginTop: '3%',
},

button:{
  marginTop: '10%',
  marginLeft : '10%',
  flexDirection: 'row',
},
viewbook:{
  backgroundColor:'#0672CF',
  padding : 10,
}
});

export default Busroute;