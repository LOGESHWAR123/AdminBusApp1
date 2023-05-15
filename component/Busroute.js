import {React,useState,useLayoutEffect,useEffect} from 'react';
import { FontAwesome } from '@expo/vector-icons';
import colors from "../colors";
import { View, Text, Dimensions, StatusBar, Button, TouchableOpacity} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, limit,getCountFromServer} from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { encode } from 'base-64';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const height = screenHeight * 0.3;
const width = screenWidth * 0.998;


function Busroute() {
  const navigation=useNavigation();
  const [bookings,setbookings]=useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [booking1,setbookings1] = useState(0);
  const [bus,setbus] = useState(0)
  
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

      const collectionRef1 = collection(database,'Buses'); 
    useLayoutEffect(() => {

        const q = query(collectionRef1)
        const unsubscribe = onSnapshot(q, querySnapshot => {
    
            querySnapshot.docs.map(doc => 
              (
              {
              Name:doc.data().Name,
              Id:doc.data().Id,
              destination:doc.data().Destination,
              price:doc.data().Price,
            }))

          console.log(querySnapshot.size);
          setbus(querySnapshot.size);
        });        
      
      return unsubscribe;
      }, 
      
      []); 

      console.log(bookings);
  
      useEffect(() => {
        navigation.setOptions({

            headerLeft: () => (
                <FontAwesome name="home" size={24} color={colors.gray} style={{marginLeft: 15}}/>
            ),

            headerRight: () => (
                <TouchableOpacity
                  style={{
                    marginRight: 10
                  }}
                  onPress={()=>navigation.navigate('Signout')}
                >
                  <FontAwesome name="user" size={25} color={'#1C64D1'} style={{marginRight: 10}} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // useEffect(() => {
    //   const fetchPayments = async () => {
    //     try {
    //       let totalAmount = 0;
    //       let hasNext = true;
    //       let skip = 0;
    //       const count = 100; // Increase the count to fetch more payments per request
    //       while (hasNext) {
    //         const response = await axios.get(`https://api.razorpay.com/v1/payments?count=${count}&skip=${skip}`, {
    //           headers: {
    //             Authorization: `Basic ${encode('rzp_test_AHMQcxkRqC6Spu' + ':' + 'QRYbHWzBklLCs9Dp9WhxJ15V')}`
    //           },
    //         });
    //         const payments = response.data.items.filter(payment => payment.status === "authorized");
    //         const paymentCount = response.data.count;
    //         if (payments.length === 0) {
    //           hasNext = false;
    //           break;
    //         }
    //         setbookings1(paymentCount)
    //         totalAmount += payments.reduce((acc, curr) => acc + curr.amount/100, 0);
    //         setTotalAmount(totalAmount)
    //         console.log(totalAmount,"--->")
    //       }

    //     } catch (error) {
    //       console.error(error,"--%%^%%");
    //     }
    //   };
    
    //   fetchPayments();
    // }, []);
    

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.texting}>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.1,fontSize:20,fontWeight:'bold'}]}>Bookings</Text>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.1,fontSize:20,fontWeight:'bold'}]}>Buses Available</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.16,fontWeight:'bold'}]}>{booking1}</Text>
          <Text style={[styles.text, { marginHorizontal: screenWidth * 0.27 ,fontWeight:'bold'}]}>{bus}</Text>
        </View>
      </View>
      <View style={styles.booking}>
        <Text style={[styles.text, {alignSelf:'center',fontSize : 14,fontWeight : 'bold'}]}>Total Earnings</Text>
        <Text style={[styles.text , { alignSelf: 'center', fontSize: 15 }]}>{totalAmount}</Text>
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
              <View style={{flexDirection: 'column', alignItems: 'flex-end',marginHorizontal:'15%'}}>
                <Text>{booking.destination}</Text>
                <Text>{booking.price}</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
    <View style={styles.addbus}>
         <TouchableOpacity style={styles.removeBus} onPress={()=>navigation.navigate('PreviousBooking')}>
                    <Text style={{fontSize:15,color:'white'}}>Bookings</Text>
           </TouchableOpacity>
            <TouchableOpacity style={styles.addNewBus} onPress={()=>navigation.navigate('UpdateBus')}>
                    <Text style={{fontSize:15,color:'white'}}>UpdateBus</Text>
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
addbus: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignSelf: 'flex-end',
  marginTop: '10%',
  marginHorizontal: 20,
},
removeBus: {
  backgroundColor: '#0672CF',
  padding: 10,
  marginRight: 10,
  flex: 1,
  alignItems: 'center',
  borderRadius: 5,
},
addNewBus: {
  backgroundColor:'#0672CF',
  padding: 10,
  flex: 1,
  alignItems: 'center',
  borderRadius: 5,
},
});

export default Busroute;