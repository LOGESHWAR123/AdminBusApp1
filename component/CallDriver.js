import {React,useState,useLayoutEffect} from 'react';
import { View, Text, Dimensions, StatusBar,ScrollView,TouchableOpacity, Linking} from 'react-native';
import { StyleSheet } from 'react-native';
import { database } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import DropCard from './Dropcard';
import { FontAwesome } from '@expo/vector-icons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import colors from '../colors';




const CallDriver = () => {
  const [driverdetails,setdriverdetails]=useState([]);
  const collectionRef = collection(database, 'SeatBookingCount'); 
  useLayoutEffect(() => {

    const unsubscribe = onSnapshot(collectionRef, querySnapshot => {
      setdriverdetails(
        querySnapshot.docs.map(doc => 
          (
          {
            drivername1: doc.data().drivername1,
            drivername2: doc.data().drivername2,
            drivernum1: doc.data().drivernum1,
            drivernum2: doc.data().drivernum2,
          }
        ))
      ),

      console.log(querySnapshot.size);
    });        
  
  return unsubscribe;
  }, 
  
  []); 
  console.log(driverdetails);
  return (
    <View style={styles.container}>
        <Text style={{marginLeft:20,fontSize:18,fontWeight:"bold",padding:5}}>Driver Details</Text>
        <ScrollView>
        {driverdetails.map((value,key)=>
                <View key={key}>

                  

                    <View style={{height:130,backgroundColor:"white",margin:15}}>

                    <Text style={{flexDirection:"row",justifyContent:"space-between",paddingLeft:20,paddingTop:10,fontSize:18,fontWeight:"bold", color:colors.primary}} >Route {key+1}</Text>

                      <View style={{flexDirection:"row",justifyContent:"space-between",paddingLeft:20,paddingTop:10,paddingBottom:10}}>
                        
                        <Text>{value.drivername1}</Text>
                        <TouchableOpacity  onPress={()=> Linking.openURL(`tel:+91${value.drivernum2}`)}>
                        <FontAwesome name="phone" size={25} style={{marginRight:30}}/>
                        </TouchableOpacity>
                      </View>

                      <View style={{flexDirection:"row",justifyContent:"space-between",paddingLeft:20,paddingTop:10}}>
                        <Text>{value.drivername2}</Text>
                        {/* <Text>{value.drivernum1}</Text> */}
                        <TouchableOpacity onPress={()=> Linking.openURL(`tel:+91${value.drivernum2}`)}>
                        <FontAwesome name="phone" size={25} style={{marginRight:30}}/>
                        </TouchableOpacity>
                        
                      </View>

                    </View>
                </View>
            )
        }
        </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
        flex:1, 
        padding:5
    }

});

export default CallDriver;