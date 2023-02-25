import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";





const PreviousBooking = () => {
  const [bookings,setbookings]=useState([]);
  const collectionRef = collection(database, 'previous booking'); 
  useLayoutEffect(() => {

    const q = query(collectionRef,orderBy('SI','desc'))
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
  );
}
const styles = StyleSheet.create({
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


viewbook:{
  backgroundColor:'#0672CF',
  padding : 10,
}
});


export default PreviousBooking;