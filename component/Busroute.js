import {React,useState,useLayoutEffect,useEffect} from 'react';
import { FontAwesome } from '@expo/vector-icons';
import colors from "../colors";
import { View, Text, Dimensions, StatusBar, Button, TouchableOpacity,Image} from 'react-native';
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
  
  const q = collection(database, 'SeatBookingCount'); 
    useLayoutEffect(() => {

        
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
        });        
      
      return unsubscribe;
      }, 
      
      []); 

      console.log(bookings);
  
      useEffect(() => {
        navigation.setOptions({

            headerLeft: () => (
                <FontAwesome name="home" size={24} color={colors.primary} style={{marginLeft: 15}}/>
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
      <View style={styles.subcontainer}>
        
      <View style={{flexDirection:"row",justifyContent:"center"}}>
      <Image
        style={styles.Logo}
        source={{uri: 'https://upload.wikimedia.org/wikipedia/en/6/61/Sri_Sai_Ram_Engineering_College_logo.png'}}
      />
      {/* <Text style={[styles.CardText,{margin:10}]}>Sairam Bus App</Text> */}
      </View>

      <View style={styles.SubConMain}>
          <View style={styles.SubConHeading}>
            <Text style={styles.SubConText}>Users</Text>
            <Text style={styles.SubConText}>11</Text>
          </View>

          <View style={styles.SubConHeading}>
            <Text style={styles.SubConText}>Bookings</Text>
            <Text style={styles.SubConText}>{booking1}</Text>
          </View>

          <View style={styles.SubConHeading}>
            <Text style={styles.SubConText}>Buses</Text>
            <Text style={styles.SubConText}>{bus}</Text>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: "white", flex: 1, padding: 10,paddingTop:20}}>
      <Text style={{fontSize:22,fontWeight:"bold",marginLeft:20,color:"black"}}>Dashboard</Text>

        <View style={styles.cardContainer}>


          <TouchableOpacity onPress={()=>navigation.navigate('UpdateBus')}>
          <View style={styles.card} >
            <Text style={styles.CardText}>Update Buses</Text>
          </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={()=> navigation.navigate('Bookings')}>
          <View style={styles.card}>
            <Text style={styles.CardText}>Bookings</Text>
          </View>
          </TouchableOpacity>


      
          {/* <TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.CardText}>Payments</Text>
          </View>
          </TouchableOpacity> */}



          <TouchableOpacity onPress={()=> navigation.navigate('CallDriver')}>
          <View style={styles.card}>
            <Text style={styles.CardText}>Call Driver</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> navigation.navigate('Reports')}>
          <View style={styles.card}>
            <Text style={styles.CardText}>Reports</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> navigation.navigate('Attendence')}>
          <View style={styles.card}>
            <Text style={styles.CardText}>Attendence</Text>
          </View>
          </TouchableOpacity>


        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({


  container:{
    flex:1, 
    // backgroundColor:"pink"
  }, 
  subcontainer:{
    height:230,
    backgroundColor:colors.primary,
    paddingTop:30,
    //justifyContent:"center", 
    //alignItems:"center"
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: screenHeight * 0.025,
    margin:screenHeight * 0.01
  },
  SubConHeading:{
    flexDirection:"column", 
    justifyContent:"space-evenly", 
    marginTop:"1%", 
    alignItems:"center"
  },
  SubConText:{
    fontSize:26, 
    fontWeight:"bold",
    color:"white"
  }, 

  CardText:{
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    color: 'white',
  },
  SubConMain:{
    flexDirection:"row", 
    justifyContent:"space-around",
    marginBottom:20
    
  }, 
  text:{
    color:"black", 
    fontSize:22,
    fontWeight:"bold"
  },

  card:{
    width: screenWidth * 0.43,
    height: screenHeight * 0.10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: screenWidth * 0.03,
    marginBottom: screenHeight * 0.03,
    // justifyContent: 'center',
    // alignItems: 'center', 
  
  }, 
  Logo:{
    width:90, 
    height:90,
    bottom:15,
  }

//   heading: {
//     backgroundColor: '#0672CF',
//     height: 200,
//     width: width,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
  
//   texting: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   text: {
//     fontSize: 17,
//     color: 'white',
//   },
  
//   dateContainer: {
//     flexDirection: 'row',
//     marginTop: 17,
//     justifyContent: 'space-between',
//   },
  
//   booking: {
//   alignSelf: 'center',
//   marginTop: '10%',
//   backgroundColor: '#0672CF',
//   width: '50%',
//   height: 50,
// },

// prevbook: {
//   marginTop: '10%',
//   marginLeft : '10%',
// },

// bo:{
//   marginTop: '3%',
// },
// addbus: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignSelf: 'flex-end',
//   marginTop: '10%',
//   marginHorizontal: 20,
// },
// removeBus: {
//   backgroundColor: '#0672CF',
//   padding: 10,
//   marginRight: 10,
//   flex: 1,
//   alignItems: 'center',
//   borderRadius: 5,
// },
// addNewBus: {
//   backgroundColor:'#0672CF',
//   padding: 10,
//   flex: 1,
//   alignItems: 'center',
//   borderRadius: 5,
// },
});

export default Busroute;



{/* <View style={styles.container}>
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
    </View> */}



    // {
//   "cli": {
//     "version": ">= 3.7.2"
//   },
//   "build": {
//     "development": {
//       "developmentClient": true,
//       "distribution": "internal",
//       "ios": {
//         "resourceClass": "m1-medium"
//       }
//     },
//     "preview": {
//       "distribution": "internal",
//       "ios": {
//         "resourceClass": "m1-medium"
//       }
//     },
//     "production": {
//       "ios": {
//         "resourceClass": "m1-medium"
//       }
//     }
//   },
//   "submit": {
//     "production": {}
//   }
// }